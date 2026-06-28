import { Injectable, Logger } from '@nestjs/common';
import { SearchEngine, SearchDocumentType, SearchOptions, SearchResults } from '@nexora/search';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private engine: SearchEngine;

  constructor() {
    this.engine = new SearchEngine();
  }

  async search(options: SearchOptions): Promise<SearchResults> {
    const start = Date.now();
    try {
      const results = await this.engine.search(options);
      this.logger.debug(`Search "${options.query}" (${options.mode}) took ${Date.now() - start}ms, found ${results.total} results`);
      return results;
    } catch (error) {
      this.logger.error(`Search failed: ${(error as Error).message}`);
      return { items: [], total: 0, limit: options.limit || 20, offset: options.offset || 0, query: options.query, mode: options.mode || 'keyword', took: Date.now() - start };
    }
  }

  async indexDocument(input: {
    entityType: string;
    entityId: string;
    title: string;
    description?: string;
    content?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    userId?: string;
    organizationId?: string;
    visibility?: string;
  }): Promise<string> {
    try {
      const docId = await this.engine.indexDocument({
        entityType: input.entityType as SearchDocumentType,
        entityId: input.entityId,
        title: input.title,
        description: input.description,
        content: input.content,
        tags: input.tags,
        metadata: input.metadata,
        userId: input.userId,
        organizationId: input.organizationId,
        visibility: (input.visibility as 'private' | 'public' | 'organization') || 'private',
      });
      this.logger.debug(`Indexed document ${input.entityType}:${input.entityId} as ${docId}`);
      return docId;
    } catch (error) {
      this.logger.error(`Index failed: ${(error as Error).message}`);
      throw error;
    }
  }

  async removeDocument(entityType: string, entityId: string): Promise<void> {
    await this.engine.removeDocument(entityType as SearchDocumentType, entityId);
  }

  async reindexAll(inputs: Array<{
    entityType: string;
    entityId: string;
    title: string;
    description?: string;
    content?: string;
    tags?: string[];
    userId?: string;
    organizationId?: string;
  }>): Promise<void> {
    await this.engine.reindexAll(inputs as any);
  }

  async getStats() {
    return this.engine.getStats();
  }
}
