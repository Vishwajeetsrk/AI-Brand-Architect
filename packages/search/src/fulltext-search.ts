import { prisma } from "@nexora/database";
import { SearchDocumentType, SearchResultItem, SearchFilters } from "./types";

export class FullTextSearch {
  async search(
    query: string,
    limit: number = 20,
    offset: number = 0,
    filters?: SearchFilters,
  ): Promise<{ items: SearchResultItem[]; total: number }> {
    const conditions: string[] = [
      `(
        sd.search_vector @@ plainto_tsquery('english', $1)
        OR sd.title ILIKE $2
        OR sd.description ILIKE $2
        OR sd.content ILIKE $2
      )`,
    ];
    const params: any[] = [query, `%${query}%`, limit, offset];
    let paramIdx = 5;

    if (filters?.entityTypes?.length) {
      conditions.push(`sd.entity_type IN (${filters.entityTypes.map(() => `$${paramIdx++}`).join(", ")})`);
      params.push(...filters.entityTypes);
    }
    if (filters?.userId) {
      conditions.push(`sd.user_id = $${paramIdx++}`);
      params.push(filters.userId);
    }
    if (filters?.organizationId) {
      conditions.push(`sd.organization_id = $${paramIdx++}`);
      params.push(filters.organizationId);
    }
    if (filters?.tags?.length) {
      conditions.push(`sd.tags && $${paramIdx++}`);
      params.push(filters.tags);
    }
    if (filters?.visibility) {
      conditions.push(`sd.visibility = $${paramIdx++}`);
      params.push(filters.visibility);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countSql = `SELECT COUNT(*) FROM search_documents sd ${where}`;
    const totalResult: any = await prisma.$queryRawUnsafe(countSql, ...params.slice(0, paramIdx - 4));
    const total = Number(totalResult[0]?.count || 0);

    const sql = `
      SELECT
        sd.id, sd.entity_type, sd.entity_type, sd.entity_id, sd.title, sd.description,
        sd.content, sd.tags, sd.metadata, sd.user_id, sd.organization_id,
        sd.created_at, sd.updated_at,
        CASE
          WHEN sd.search_vector IS NOT NULL THEN ts_rank(sd.search_vector, plainto_tsquery('english', $1))
          ELSE 0
        END + 
        CASE WHEN sd.title ILIKE $2 THEN 1.0 ELSE 0 END +
        CASE WHEN sd.description ILIKE $2 THEN 0.5 ELSE 0 END AS score
      FROM search_documents sd
      ${where}
      ORDER BY score DESC, sd.updated_at DESC
      LIMIT $3 OFFSET $4
    `;

    const rows = await prisma.$queryRawUnsafe<any[]>(sql, ...params);

    const items = rows.map((r: any) => ({
      id: r.id,
      entityType: r.entity_type as SearchDocumentType,
      entityId: r.entity_id,
      title: r.title,
      description: r.description,
      content: r.content,
      tags: r.tags || [],
      metadata: r.metadata,
      score: r.score ?? 0,
      userId: r.user_id,
      organizationId: r.organization_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return { items, total };
  }
}
