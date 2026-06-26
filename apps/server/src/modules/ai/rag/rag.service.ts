import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import { v4 as uuidv4 } from 'uuid';

interface Chunk {
  id: string;
  documentId: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

interface Document {
  id: string;
  title: string;
  content: string;
  chunks: Chunk[];
  metadata: Record<string, any>;
  createdAt: Date;
}

@Injectable()
export class RagService {
  private documents: Document[] = [];

  constructor(private readonly aiService: AiService) {}

  async ingestDocument(title: string, content: string, metadata: Record<string, any> = {}): Promise<Document> {
    const chunks = await this.chunkDocument(content);
    const embeddedChunks: Chunk[] = [];

    for (const chunkText of chunks) {
      const embedding = await this.aiService.generateEmbedding(chunkText);
      embeddedChunks.push({
        id: uuidv4(),
        documentId: '',
        content: chunkText,
        embedding,
        metadata,
      });
    }

    const doc: Document = {
      id: uuidv4(),
      title,
      content,
      chunks: embeddedChunks.map((c) => ({ ...c, documentId: uuidv4() })),
      metadata,
      createdAt: new Date(),
    };
    doc.chunks = embeddedChunks.map((c) => ({ ...c, documentId: doc.id }));
    this.documents.push(doc);
    return doc;
  }

  async search(query: string, topK: number = 5, similarityThreshold: number = 0.5): Promise<{ content: string; score: number; metadata: Record<string, any> }[]> {
    const queryEmbedding = await this.aiService.generateEmbedding(query);
    const allChunks = this.documents.flatMap((d) => d.chunks);
    const scored = allChunks
      .map((chunk) => ({
        content: chunk.content,
        score: this.cosineSimilarity(queryEmbedding, chunk.embedding),
        metadata: chunk.metadata,
      }))
      .filter((item) => item.score >= similarityThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored;
  }

  getDocument(id: string): Document | undefined {
    return this.documents.find((d) => d.id === id);
  }

  listDocuments(): Omit<Document, 'chunks'>[] {
    return this.documents.map(({ chunks, ...rest }) => rest);
  }

  removeDocument(id: string): void {
    const index = this.documents.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.documents.splice(index, 1);
    }
  }

  private async chunkDocument(content: string, chunkSize: number = 500): Promise<string[]> {
    const chunks: string[] = [];
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
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
}
