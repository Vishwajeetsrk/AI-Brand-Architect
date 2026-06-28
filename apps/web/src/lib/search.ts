const API_BASE = "/api";

export interface SearchResultItem {
  id: string;
  entityType: string;
  entityId: string;
  title: string;
  description: string | null;
  content: string | null;
  tags: string[];
  metadata: Record<string, any> | null;
  score: number;
  userId: string | null;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResults {
  items: SearchResultItem[];
  total: number;
  limit: number;
  offset: number;
  query: string;
  mode: string;
  took: number;
}

export async function globalSearch(
  query: string,
  options?: { mode?: "keyword" | "semantic" | "hybrid"; types?: string[]; limit?: number; offset?: number }
): Promise<SearchResults> {
  const params = new URLSearchParams({ q: query });
  if (options?.mode) params.set("mode", options.mode);
  if (options?.types?.length) params.set("types", options.types.join(","));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));

  const res = await fetch(`${API_BASE}/search?${params.toString()}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
  return res.json();
}

export async function indexDocument(data: {
  entityType: string;
  entityId: string;
  title: string;
  description?: string;
  content?: string;
  tags?: string[];
  userId?: string;
  organizationId?: string;
}): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE}/search/index`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Index failed: ${res.statusText}`);
  return res.json();
}

export async function removeDocument(type: string, id: string): Promise<void> {
  await fetch(`${API_BASE}/search/index?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getSearchStats(): Promise<{ totalDocuments: number; byType: Record<string, number>; lastIndexed: string | null }> {
  const res = await fetch(`${API_BASE}/search/stats`);
  if (!res.ok) throw new Error(`Stats failed: ${res.statusText}`);
  return res.json();
}
