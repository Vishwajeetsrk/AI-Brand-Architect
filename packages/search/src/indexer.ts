import { prisma } from "@nexora/database";
import { IndexDocumentInput, SearchDocumentType, IndexStats } from "./types";

export class SearchIndexer {
  async index(input: IndexDocumentInput): Promise<string> {
    const existing = await prisma.searchDocument.findFirst({
      where: { entityType: input.entityType, entityId: input.entityId },
    });

    const data: any = {
      entityType: input.entityType,
      entityId: input.entityId,
      title: input.title || "",
      description: input.description || null,
      content: input.content || null,
      tags: input.tags || [],
      metadata: input.metadata || {},
      userId: input.userId || null,
      organizationId: input.organizationId || null,
      visibility: input.visibility || "private",
    };

    if (existing) {
      await prisma.searchDocument.update({
        where: { id: existing.id },
        data,
      });
      return existing.id;
    }

    const doc = await prisma.searchDocument.create({ data });
    return doc.id;
  }

  async bulkIndex(inputs: IndexDocumentInput[]): Promise<number> {
    let count = 0;
    for (const input of inputs) {
      await this.index(input);
      count++;
    }
    return count;
  }

  async remove(entityType: SearchDocumentType, entityId: string): Promise<void> {
    await prisma.searchDocument.deleteMany({
      where: { entityType, entityId },
    });
  }

  async removeById(id: string): Promise<void> {
    await prisma.searchDocument.delete({ where: { id } });
  }

  async clear(entityType?: SearchDocumentType): Promise<number> {
    const where = entityType ? { entityType } : {};
    const result = await prisma.searchDocument.deleteMany({ where });
    return result.count;
  }

  async getStats(): Promise<IndexStats> {
    const [total, byTypeRaw, lastDoc] = await Promise.all([
      prisma.searchDocument.count(),
      prisma.searchDocument.groupBy({
        by: ["entityType"],
        _count: { id: true },
      }),
      prisma.searchDocument.findFirst({
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
      }),
    ]);

    const byType: Record<string, number> = {};
    for (const row of byTypeRaw) {
      byType[row.entityType] = row._count.id;
    }

    return {
      totalDocuments: total,
      byType,
      lastIndexed: lastDoc?.updatedAt || null,
    };
  }

  async updateSearchVector(documentId: string): Promise<void> {
    await prisma.$executeRawUnsafe(
      `UPDATE search_documents 
       SET search_vector = to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, ''))
       WHERE id = $1`,
      documentId,
    );
  }

  async updateAllSearchVectors(): Promise<number> {
    const result = await prisma.$executeRawUnsafe(`
      UPDATE search_documents 
      SET search_vector = to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, ''))
      WHERE search_vector IS NULL
    `);
    return result;
  }
}
