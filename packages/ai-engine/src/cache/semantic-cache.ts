import { LLMMessage, LLMResponse } from '../types';

interface CacheEntry {
  response: LLMResponse;
  prompt: string;
  model: string;
  temperature?: number;
  timestamp: number;
  ttl: number;
  accessCount: number;
  hash: string;
}

interface CacheConfig {
  ttl: number;
  maxEntries: number;
  similarityThreshold: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
}

function hashPrompt(messages: LLMMessage[], model: string, temperature?: number): string {
  const input = messages.map(m => `${m.role}:${m.content}`).join('|') + `|model:${model}|temp:${temperature ?? 0.7}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
}

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

export class SemanticCache {
  private cache: Map<string, CacheEntry> = new Map();
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  constructor(private config: CacheConfig = { ttl: 300000, maxEntries: 1000, similarityThreshold: 0.85 }) {}

  async get(messages: LLMMessage[], model: string, temperature?: number): Promise<LLMResponse | null> {
    const exactHash = hashPrompt(messages, model, temperature);
    const now = Date.now();

    const exact = this.cache.get(exactHash);
    if (exact && now - exact.timestamp < exact.ttl) {
      exact.accessCount++;
      this.hits++;
      return { ...exact.response };
    }

    const queryTokens = tokenize(messages.map(m => m.content).join(' '));

    let bestMatch: { entry: CacheEntry; score: number } | null = null;
    for (const [, entry] of this.cache) {
      if (now - entry.timestamp >= entry.ttl) continue;
      const entryTokens = tokenize(entry.prompt);
      const score = jaccardSimilarity(queryTokens, entryTokens);
      if (score > (bestMatch?.score ?? 0) && score >= this.config.similarityThreshold) {
        bestMatch = { entry, score };
      }
    }

    if (bestMatch && bestMatch.entry.model === model) {
      this.hits++;
      bestMatch.entry.accessCount++;
      return { ...bestMatch.entry.response };
    }

    this.misses++;
    return null;
  }

  async set(messages: LLMMessage[], model: string, response: LLMResponse, temperature?: number): Promise<void> {
    const hash = hashPrompt(messages, model, temperature);
    const prompt = messages.map(m => m.content).join(' ');

    if (this.cache.has(hash)) return;

    if (this.cache.size >= this.config.maxEntries) {
      this.evictOne();
    }

    this.cache.set(hash, {
      response,
      prompt,
      model,
      temperature,
      timestamp: Date.now(),
      ttl: this.config.ttl,
      accessCount: 0,
      hash,
    });
  }

  invalidate(model?: string): void {
    if (model) {
      for (const [key, entry] of this.cache) {
        if (entry.model === model) this.cache.delete(key);
      }
    } else {
      this.cache.clear();
    }
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      evictions: this.evictions,
    };
  }

  private evictOne(): void {
    let oldest: string | null = null;
    let oldestTime = Infinity;
    for (const [key, entry] of this.cache) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldest = key;
      }
    }
    if (oldest) {
      this.cache.delete(oldest);
      this.evictions++;
    }
  }
}
