import { prisma } from "@nexora/database";
import { SearchDocumentType, SearchResultItem, SearchFilters } from "./types";

export class VectorSearch {
  async search(
    embedding: number[],
    limit: number = 20,
    filters?: SearchFilters,
  ): Promise<SearchResultItem[]> {
    const conditions: string[] = [];
    const params: any[] = [JSON.stringify(embedding), limit];
    let paramIdx = 3;

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
    if (filters?.visibility) {
      conditions.push(`sd.visibility = $${paramIdx++}`);
      params.push(filters.visibility);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT
        sd.id, sd.entity_type, sd.entity_id, sd.title, sd.description,
        sd.content, sd.tags, sd.metadata, sd.user_id, sd.organization_id,
        sd.created_at, sd.updated_at,
        1 - (sd.embedding <=> $1::vector) AS score
      FROM search_documents sd
      ${where}
      AND sd.embedding IS NOT NULL
      ORDER BY sd.embedding <=> $1::vector
      LIMIT $2
    `;

    const rows = await prisma.$queryRawUnsafe<any[]>(sql, ...params);

    return rows.map((r: any) => ({
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
  }

  async indexEmbedding(documentId: string, embedding: number[]): Promise<void> {
    await prisma.$executeRawUnsafe(
      `UPDATE search_documents SET embedding = $1::vector WHERE id = $2`,
      JSON.stringify(embedding),
      documentId,
    );
  }

  async removeEmbedding(documentId: string): Promise<void> {
    await prisma.$executeRawUnsafe(
      `UPDATE search_documents SET embedding = NULL WHERE id = $1`,
      documentId,
    );
  }
}
