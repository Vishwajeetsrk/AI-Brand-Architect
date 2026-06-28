import { prisma } from "@nexora/database";
import { SearchDocumentType, SearchResultItem, SearchFilters } from "./types";

const RRF_K = 60;

export class HybridSearch {
  async search(
    query: string,
    embedding: number[],
    limit: number = 20,
    offset: number = 0,
    filters?: SearchFilters,
  ): Promise<{ items: SearchResultItem[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [query, `%${query}%`, JSON.stringify(embedding), limit, offset];
    let paramIdx = 6;

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

    const where = conditions.length ? `AND ${conditions.join(" AND ")}` : "";

    const countSql = `
      SELECT COUNT(*) FROM search_documents sd
      WHERE (
        sd.search_vector @@ plainto_tsquery('english', $1)
        OR sd.title ILIKE $2
        OR sd.description ILIKE $2
        OR sd.content ILIKE $2
      )
      AND sd.embedding IS NOT NULL
      ${where}
    `;
    const totalResult: any = await prisma.$queryRawUnsafe(
      countSql,
      ...params.slice(0, paramIdx - 4),
    );
    const total = Number(totalResult[0]?.count || 0);

    const sql = `
      WITH ranked AS (
        SELECT
          sd.id, sd.entity_type, sd.entity_type, sd.entity_id, sd.title, sd.description,
          sd.content, sd.tags, sd.metadata, sd.user_id, sd.organization_id,
          sd.created_at, sd.updated_at,
          COALESCE(ts_rank(sd.search_vector, plainto_tsquery('english', $1)), 0) +
            CASE WHEN sd.title ILIKE $2 THEN 0.8 ELSE 0 END +
            CASE WHEN sd.description ILIKE $2 THEN 0.4 ELSE 0 END AS keyword_score,
          1 - COALESCE(sd.embedding <=> $3::vector, 1) AS semantic_score
        FROM search_documents sd
        WHERE (
          sd.search_vector @@ plainto_tsquery('english', $1)
          OR sd.title ILIKE $2
          OR sd.description ILIKE $2
          OR sd.content ILIKE $2
        )
        AND sd.embedding IS NOT NULL
        ${where}
      ),
      keyword_ranked AS (
        SELECT *, ROW_NUMBER() OVER (ORDER BY keyword_score DESC) AS k_rank
        FROM ranked WHERE keyword_score > 0
      ),
      semantic_ranked AS (
        SELECT *, ROW_NUMBER() OVER (ORDER BY semantic_score DESC) AS s_rank
        FROM ranked WHERE semantic_score > 0
      )
      SELECT
        COALESCE(kr.id, sr.id) AS id,
        COALESCE(kr.entity_type, sr.entity_type) AS entity_type,
        COALESCE(kr.entity_id, sr.entity_id) AS entity_id,
        COALESCE(kr.title, sr.title) AS title,
        COALESCE(kr.description, sr.description) AS description,
        COALESCE(kr.content, sr.content) AS content,
        COALESCE(kr.tags, sr.tags) AS tags,
        COALESCE(kr.metadata, sr.metadata) AS metadata,
        COALESCE(kr.user_id, sr.user_id) AS user_id,
        COALESCE(kr.organization_id, sr.organization_id) AS organization_id,
        COALESCE(kr.created_at, sr.created_at) AS created_at,
        COALESCE(kr.updated_at, sr.updated_at) AS updated_at,
        (
          COALESCE(1.0 / (${RRF_K} + COALESCE(kr.k_rank, ${RRF_K} + 100)), 0) +
          COALESCE(1.0 / (${RRF_K} + COALESCE(sr.s_rank, ${RRF_K} + 100)), 0)
        ) AS score
      FROM keyword_ranked kr
      FULL OUTER JOIN semantic_ranked sr ON kr.id = sr.id
      ORDER BY score DESC
      LIMIT $4 OFFSET $5
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
