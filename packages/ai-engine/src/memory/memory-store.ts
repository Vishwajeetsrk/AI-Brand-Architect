import { Memory, MemoryType } from '../types';
import { getProvider } from '../llm/provider-factory';

interface MemoryEntry extends Memory {
  accessCount: number;
  lastAccessed: number;
  consolidated: boolean;
}

export class MemoryStore {
  private memories: Map<string, MemoryEntry> = new Map();
  private consolidationThreshold: number;
  private defaultTtl: number;

  constructor(consolidationThreshold: number = 5, defaultTtl: number = 3600000) {
    this.consolidationThreshold = consolidationThreshold;
    this.defaultTtl = defaultTtl;
  }

  async store(memory: Omit<Memory, 'timestamp' | 'embedding'>, apiKey?: string): Promise<Memory> {
    const fullMemory: MemoryEntry = {
      ...memory,
      timestamp: Date.now(),
      ttl: memory.ttl ?? this.getDefaultTtlForType(memory.type),
      accessCount: 0,
      lastAccessed: Date.now(),
      consolidated: false,
    };

    if (memory.content.length > 50 && apiKey) {
      try {
        const provider = getProvider('openai', apiKey);
        fullMemory.embedding = await provider.generateEmbedding(memory.content);
      } catch {
        // Proceed without embedding
      }
    }

    this.memories.set(memory.id, fullMemory);
    this.evictExpired();
    return { ...fullMemory, embedding: undefined };
  }

  async storeMany(memories: Omit<Memory, 'timestamp' | 'embedding'>[], apiKey?: string): Promise<Memory[]> {
    return Promise.all(memories.map(m => this.store(m, apiKey)));
  }

  recall(memoryId: string): Memory | undefined {
    const entry = this.memories.get(memoryId);
    if (!entry) return undefined;

    if (this.isExpired(entry)) {
      this.memories.delete(memoryId);
      return undefined;
    }

    entry.accessCount++;
    entry.lastAccessed = Date.now();
    return { ...entry, embedding: undefined };
  }

  async search(query: string, limit: number = 5, type?: MemoryType, apiKey?: string): Promise<Memory[]> {
    this.evictExpired();

    const candidates = Array.from(this.memories.values())
      .filter(m => !this.isExpired(m))
      .filter(m => !type || m.type === type);

    if (candidates.length === 0) return [];

    if (apiKey && query.length > 10) {
      return this.semanticSearch(query, candidates, limit, apiKey);
    }

    return this.keywordSearch(query, candidates, limit);
  }

  async recallByType(type: MemoryType, limit: number = 10): Promise<Memory[]> {
    this.evictExpired();

    return Array.from(this.memories.values())
      .filter(m => m.type === type && !this.isExpired(m))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map(m => ({ ...m, embedding: undefined }));
  }

  async forget(memoryId: string): Promise<boolean> {
    return this.memories.delete(memoryId);
  }

  async forgetByType(type: MemoryType): Promise<number> {
    let count = 0;
    for (const [id, mem] of this.memories) {
      if (mem.type === type) {
        this.memories.delete(id);
        count++;
      }
    }
    return count;
  }

  async clear(): Promise<void> {
    this.memories.clear();
  }

  async consolidate(apiKey?: string): Promise<Memory[]> {
    const candidates = Array.from(this.memories.values())
      .filter(m => m.accessCount >= this.consolidationThreshold && !m.consolidated);

    if (candidates.length === 0) return [];

    const consolidated: Memory[] = [];

    for (const candidate of candidates) {
      try {
        const summary = await this.summarizeMemory(candidate, apiKey);
        const semanticMemory: MemoryEntry = {
          id: `semantic-${candidate.id}`,
          type: 'semantic',
          content: summary,
          metadata: {
            ...candidate.metadata,
            sourceMemoryId: candidate.id,
            originalType: candidate.type,
            accessCount: candidate.accessCount,
          },
          timestamp: Date.now(),
          ttl: this.getDefaultTtlForType('semantic'),
          accessCount: 0,
          lastAccessed: Date.now(),
          consolidated: true,
        };

        this.memories.set(semanticMemory.id, semanticMemory);
        candidate.consolidated = true;

        consolidated.push({ ...semanticMemory, embedding: undefined });
      } catch {
        candidate.consolidated = true;
      }
    }

    return consolidated;
  }

  getStats(): {
    total: number;
    byType: Record<MemoryType, number>;
    expired: number;
  } {
    this.evictExpired();

    const byType: Record<string, number> = {};
    let expired = 0;

    for (const mem of this.memories.values()) {
      byType[mem.type] = (byType[mem.type] || 0) + 1;
      if (this.isExpired(mem)) expired++;
    }

    return {
      total: this.memories.size,
      byType: byType as Record<MemoryType, number>,
      expired,
    };
  }

  private async semanticSearch(query: string, candidates: MemoryEntry[], limit: number, apiKey: string): Promise<Memory[]> {
    const provider = getProvider('openai', apiKey);

    const queryEmbedding = await provider.generateEmbedding(query);

    const entriesWithEmbedding = candidates.filter(c => c.embedding);

    if (entriesWithEmbedding.length === 0) {
      return this.keywordSearch(query, candidates, limit);
    }

    for (const entry of candidates) {
      if (!entry.embedding) continue;

      const score = this.cosineSimilarity(queryEmbedding, entry.embedding);
      (entry as any).similarityScore = score;
    }

    return entriesWithEmbedding
      .sort((a, b) => ((b as any).similarityScore || 0) - ((a as any).similarityScore || 0))
      .slice(0, limit)
      .map(m => ({ ...m, embedding: undefined }));
  }

  private keywordSearch(query: string, candidates: MemoryEntry[], limit: number): Memory[] {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    const scored = candidates.map(m => {
      const content = m.content.toLowerCase();
      let score = 0;
      for (const term of queryTerms) {
        const regex = new RegExp(term, 'gi');
        const matches = content.match(regex);
        if (matches) score += matches.length;
      }
      return { memory: m, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => ({ ...s.memory, embedding: undefined }));
  }

  private async summarizeMemory(memory: MemoryEntry, apiKey?: string): Promise<string> {
    if (!apiKey) {
      return `[Consolidated] ${memory.content.slice(0, 200)}...`;
    }

    const provider = getProvider('openai', apiKey);
    const response = await provider.generateText([
      {
        role: 'system',
        content: 'Summarize the following memory into a concise, semantically rich representation.',
      },
      {
        role: 'user',
        content: memory.content,
      },
    ], { model: 'gpt-4o-mini', maxTokens: 200 });

    return response.content;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  private isExpired(memory: MemoryEntry): boolean {
    if (!memory.ttl) return false;
    return Date.now() > memory.timestamp + memory.ttl;
  }

  private evictExpired(): void {
    for (const [id, mem] of this.memories) {
      if (this.isExpired(mem)) {
        this.memories.delete(id);
      }
    }
  }

  private getDefaultTtlForType(type: MemoryType): number {
    switch (type) {
      case 'working': return 300000;
      case 'short_term': return 3600000;
      case 'long_term': return 86400000 * 30;
      case 'semantic': return 86400000 * 90;
      case 'episodic': return 86400000 * 7;
      default: return this.defaultTtl;
    }
  }
}
