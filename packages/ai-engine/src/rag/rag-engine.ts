import { Chunk, Document, SearchResult, RAGConfig } from '../types';
import { getProvider } from '../llm/provider-factory';

export class RAGEngine {
  private chunks: Map<string, Chunk> = new Map();
  private documents: Map<string, Document> = new Map();
  private config: RAGConfig;

  constructor(config?: Partial<RAGConfig>) {
    this.config = {
      chunkSize: config?.chunkSize || 1000,
      chunkOverlap: config?.chunkOverlap || 200,
      topK: config?.topK || 5,
      minScore: config?.minScore || 0.5,
    };
  }

  setConfig(config: Partial<RAGConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): RAGConfig {
    return { ...this.config };
  }

  async ingestDocument(document: Omit<Document, 'chunks'>, apiKey?: string): Promise<Document> {
    const chunks = this.chunkText(document.content, document.id);
    const fullDoc: Document = {
      ...document,
      chunks,
    };

    this.documents.set(document.id, fullDoc);
    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk);
    }

    await this.generateEmbeddings(fullDoc, apiKey);
    return fullDoc;
  }

  async search(query: string, apiKey?: string): Promise<SearchResult[]> {
    const queryEmbedding = await this.generateEmbedding(query, apiKey);

    const results: SearchResult[] = [];
    for (const chunk of this.chunks.values()) {
      if (!chunk.embedding) continue;

      const score = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      if (score >= this.config.minScore) {
        results.push({ chunk, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, this.config.topK);
  }

  async hybridSearch(query: string, apiKey?: string): Promise<SearchResult[]> {
    const semanticResults = await this.search(query, apiKey);
    const keywordResults = this.keywordSearch(query);

    const merged = new Map<string, SearchResult>();

    for (const result of semanticResults) {
      merged.set(result.chunk.id, result);
    }

    for (const result of keywordResults) {
      const existing = merged.get(result.chunk.id);
      if (existing) {
        existing.score = Math.max(existing.score, result.score);
      } else {
        merged.set(result.chunk.id, result);
      }
    }

    return Array.from(merged.values())
      .filter(r => r.score >= this.config.minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.topK);
  }

  buildContext(results: SearchResult[], maxTokens: number = 4000): string {
    let context = '';
    let totalTokens = 0;

    for (const result of results) {
      const chunkTokens = this.estimateTokens(result.chunk.content);
      if (totalTokens + chunkTokens > maxTokens) break;

      context += `[Source: ${result.chunk.metadata?.source || 'unknown'}]\n${result.chunk.content}\n\n`;
      totalTokens += chunkTokens;
    }

    return context.trim();
  }

  getDocument(documentId: string): Document | undefined {
    return this.documents.get(documentId);
  }

  getChunk(chunkId: string): Chunk | undefined {
    return this.chunks.get(chunkId);
  }

  removeDocument(documentId: string): void {
    const doc = this.documents.get(documentId);
    if (doc) {
      for (const chunk of doc.chunks) {
        this.chunks.delete(chunk.id);
      }
      this.documents.delete(documentId);
    }
  }

  clear(): void {
    this.chunks.clear();
    this.documents.clear();
  }

  private chunkText(text: string, documentId: string): Chunk[] {
    const chunks: Chunk[] = [];
    const { chunkSize, chunkOverlap } = this.config;
    const words = text.split(/\s+/);
    let start = 0;

    while (start < words.length) {
      const end = Math.min(start + chunkSize, words.length);
      const content = words.slice(start, end).join(' ');

      chunks.push({
        id: `${documentId}-chunk-${chunks.length}`,
        content,
        metadata: {
          documentId,
          chunkIndex: chunks.length,
          startWord: start,
          endWord: end,
        },
      });

      start += chunkSize - chunkOverlap;
    }

    return chunks;
  }

  private async generateEmbeddings(document: Document, apiKey?: string): Promise<void> {
    const provider = getProvider('openai', apiKey);

    const batchSize = 20;
    for (let i = 0; i < document.chunks.length; i += batchSize) {
      const batch = document.chunks.slice(i, i + batchSize);
      const embeddings = await Promise.all(
        batch.map(chunk =>
          provider.generateEmbedding(chunk.content).catch(() => undefined),
        ),
      );

      for (let j = 0; j < batch.length; j++) {
        if (embeddings[j]) {
          batch[j].embedding = embeddings[j];
          this.chunks.set(batch[j].id, batch[j]);
        }
      }
    }
  }

  private async generateEmbedding(text: string, apiKey?: string): Promise<number[]> {
    const provider = getProvider('openai', apiKey);
    return provider.generateEmbedding(text);
  }

  private keywordSearch(query: string): SearchResult[] {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const results: SearchResult[] = [];

    for (const chunk of this.chunks.values()) {
      const content = chunk.content.toLowerCase();
      let score = 0;

      for (const term of queryTerms) {
        const regex = new RegExp(term, 'gi');
        const matches = content.match(regex);
        if (matches) score += matches.length;
      }

      if (score > 0) {
        const normalizedScore = Math.min(score / queryTerms.length, 1);
        results.push({ chunk, score: normalizedScore });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, this.config.topK);
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

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
