export enum SearchDocumentType {
  BRAND = "BRAND",
  PROJECT = "PROJECT",
  ASSET = "ASSET",
  USER = "USER",
  KNOWLEDGE = "KNOWLEDGE",
  CONVERSATION = "CONVERSATION",
  MARKETPLACE = "MARKETPLACE",
  COMPONENT = "COMPONENT",
  TEMPLATE = "TEMPLATE",
  NOTE = "NOTE",
  ORGANIZATION = "ORGANIZATION",
}

export type SearchMode = "keyword" | "semantic" | "hybrid";

export interface SearchFilters {
  entityTypes?: SearchDocumentType[];
  userId?: string;
  organizationId?: string;
  tags?: string[];
  visibility?: "private" | "public" | "organization";
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SearchOptions {
  query: string;
  mode?: SearchMode;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
  minScore?: number;
}

export interface SearchResultItem {
  id: string;
  entityType: SearchDocumentType;
  entityId: string;
  title: string;
  description: string | null;
  content: string | null;
  tags: string[];
  metadata: Record<string, any> | null;
  score: number;
  highlights?: { field: string; snippet: string }[];
  userId: string | null;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResults {
  items: SearchResultItem[];
  total: number;
  limit: number;
  offset: number;
  query: string;
  mode: SearchMode;
  took: number;
}

export interface IndexDocumentInput {
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
  embedding?: number[];
}

export interface IndexStats {
  totalDocuments: number;
  byType: Record<string, number>;
  lastIndexed: Date | null;
}
