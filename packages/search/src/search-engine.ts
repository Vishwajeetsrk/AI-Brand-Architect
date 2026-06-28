import { SearchIndexer } from "./indexer";
import { FullTextSearch } from "./fulltext-search";
import { VectorSearch } from "./vector-search";
import { HybridSearch } from "./hybrid-search";
import { SearchOptions, SearchResults, SearchResultItem, SearchMode, SearchDocumentType } from "./types";

export class SearchEngine {
  private indexer: SearchIndexer;
  private fullTextSearch: FullTextSearch;
  private vectorSearch: VectorSearch;
  private hybridSearch: HybridSearch;

  constructor() {
    this.indexer = new SearchIndexer();
    this.fullTextSearch = new FullTextSearch();
    this.vectorSearch = new VectorSearch();
    this.hybridSearch = new HybridSearch();
  }

  async search(options: SearchOptions): Promise<SearchResults> {
    const startTime = Date.now();
    const { query, mode = "keyword", filters, limit = 20, offset = 0, minScore = 0 } = options;

    if (!query?.trim()) {
      return { items: [], total: 0, limit, offset, query, mode, took: 0 };
    }

    let result: { items: SearchResultItem[]; total: number };

    switch (mode) {
      case "semantic":
        const embedding = await this.generateEmbedding(query);
        const semanticItems = await this.vectorSearch.search(embedding, limit + offset, filters);
        result = {
          items: semanticItems.slice(offset, offset + limit),
          total: semanticItems.length,
        };
        break;

      case "hybrid":
        const hybridEmbedding = await this.generateEmbedding(query);
        result = await this.hybridSearch.search(query, hybridEmbedding, limit, offset, filters);
        break;

      case "keyword":
      default:
        result = await this.fullTextSearch.search(query, limit, offset, filters);
        break;
    }

    const filtered = result.items.filter((i) => i.score >= minScore);
    const took = Date.now() - startTime;

    return {
      items: filtered,
      total: result.total,
      limit,
      offset,
      query,
      mode,
      took,
    };
  }

  async indexDocument(input: {
    entityType: SearchDocumentType;
    entityId: string;
    title: string;
    description?: string;
    content?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    userId?: string;
    organizationId?: string;
    visibility?: "private" | "public" | "organization";
  }): Promise<string> {
    const docId = await this.indexer.index(input);
    await this.indexer.updateSearchVector(docId);

    if (input.content || input.description) {
      const text = [input.title, input.description, input.content].filter(Boolean).join(" ");
      this.generateEmbedding(text)
        .then((embedding) => {
          this.vectorSearch.indexEmbedding(docId, embedding).catch(() => {});
        })
        .catch(() => {});
    }

    return docId;
  }

  async removeDocument(entityType: SearchDocumentType, entityId: string): Promise<void> {
    await this.indexer.remove(entityType, entityId);
  }

  async reindexAll(inputs: {
    entityType: SearchDocumentType;
    entityId: string;
    title: string;
    description?: string;
    content?: string;
    tags?: string[];
    userId?: string;
    organizationId?: string;
  }[]): Promise<void> {
    await this.indexer.clear();
    await this.indexer.bulkIndex(inputs);
    await this.indexer.updateAllSearchVectors();
  }

  async getStats() {
    return this.indexer.getStats();
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    if (process.env.NODE_ENV === "test" || !process.env.OPENAI_API_KEY) {
      return new Array(1536).fill(0);
    }
    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          input: text,
          model: "text-embedding-3-small",
        }),
      });
      const data = await response.json();
      return data.data?.[0]?.embedding || new Array(1536).fill(0);
    } catch {
      return new Array(1536).fill(0);
    }
  }
}

export { SearchIndexer, FullTextSearch, VectorSearch, HybridSearch };
export * from "./types";
