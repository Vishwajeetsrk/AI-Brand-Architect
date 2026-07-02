import { LLMMessage, messageContentToString } from '../types';

export interface CompressionConfig {
  enabled: boolean;
  maxTokens: number;
  compressionRatio: number;
  summarizeLongestMessages: boolean;
}

const DEFAULT_CONFIG: CompressionConfig = {
  enabled: true,
  maxTokens: 4096,
  compressionRatio: 0.5,
  summarizeLongestMessages: true,
};

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function removeRedundantWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function extractKeySentences(text: string, maxChars: number): string {
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
  if (sentences.length <= 1) return text.substring(0, maxChars);

  const scored = sentences.map(s => {
    const trimmed = s.trim();
    const length = trimmed.length;
    const hasKeyTerms = /important|critical|key|essential|must|should|required|note|summary/i.test(trimmed);
    const score = hasKeyTerms ? length * 1.5 : length;
    return { text: trimmed, score };
  });

  scored.sort((a, b) => b.score - a.score);

  let result = '';
  for (const s of scored) {
    if ((result.length + s.text.length + 1) <= maxChars) {
      result += s.text + ' ';
    }
  }

  return result.trim() || text.substring(0, maxChars);
}

export class PromptCompressor {
  private config: CompressionConfig;

  constructor(config?: Partial<CompressionConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async compress(messages: LLMMessage[], contextLength: number = 0): Promise<LLMMessage[]> {
    if (!this.config.enabled || messages.length === 0) return messages;

    const totalTokens = messages.reduce((sum, m) => sum + estimateTokens(messageContentToString(m.content)), 0) + contextLength;
    const targetTokens = Math.min(this.config.maxTokens, Math.floor(totalTokens * this.config.compressionRatio));

    if (totalTokens <= this.config.maxTokens) return messages;

    return this.compressMessages(messages, targetTokens);
  }

  updateConfig(config: Partial<CompressionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): CompressionConfig {
    return { ...this.config };
  }

  private compressMessages(messages: LLMMessage[], targetTokens: number): LLMMessage[] {
    const result: LLMMessage[] = [];
    let currentTokens = 0;

    const systemMessages = messages.filter(m => m.role === 'system');
    const nonSystemMessages = messages.filter(m => m.role !== 'system');

    for (const msg of systemMessages) {
      const compressed = this.compressByRatio(messageContentToString(msg.content), this.config.compressionRatio * 1.2);
      const tokens = estimateTokens(compressed);
      if (currentTokens + tokens <= targetTokens) {
        result.push({ ...msg, content: compressed });
        currentTokens += tokens;
      }
    }

    const remainingBudget = targetTokens - currentTokens;
    if (this.config.summarizeLongestMessages) {
      nonSystemMessages.sort((a, b) => b.content.length - a.content.length);
    }

    for (const msg of nonSystemMessages) {
      const tokens = estimateTokens(messageContentToString(msg.content));
      if (currentTokens + tokens <= targetTokens) {
        result.push(msg);
        currentTokens += tokens;
      } else {
        const available = Math.max(0, targetTokens - currentTokens);
        if (available > 0) {
          const chars = available * 4;
          const compressed = extractKeySentences(messageContentToString(msg.content), chars);
          result.push({ ...msg, content: compressed });
          currentTokens += estimateTokens(compressed);
        }
      }
    }

    return result;
  }

  private compressByRatio(text: string, ratio: number): string {
    const cleaned = removeRedundantWhitespace(text);
    if (ratio >= 1) return cleaned;

    const targetLength = Math.floor(cleaned.length * ratio);
    if (targetLength >= cleaned.length) return cleaned;

    return extractKeySentences(cleaned, targetLength);
  }
}
