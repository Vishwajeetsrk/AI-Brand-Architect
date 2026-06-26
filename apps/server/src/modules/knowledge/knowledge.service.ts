import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, KnowledgeDocument, KnowledgeBase } from '@nexora/database';

@Injectable()
export class KnowledgeService {
  async getCategories(): Promise<KnowledgeBase[]> {
    return prisma.knowledgeBase.findMany();
  }

  async getArticles(knowledgeBaseId?: string): Promise<KnowledgeDocument[]> {
    const where = knowledgeBaseId ? { knowledgeBaseId } : {};
    return prisma.knowledgeDocument.findMany({ where });
  }

  async getArticle(id: string): Promise<KnowledgeDocument | null> {
    const article = await prisma.knowledgeDocument.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async createArticle(data: any): Promise<KnowledgeDocument> {
    const baseId = data.category || 'default';
    await prisma.knowledgeBase.upsert({
      where: { id: baseId },
      update: {},
      create: { id: baseId, name: data.category || 'General', type: 'DOCUMENT', userId: data.authorId || 'system' },
    });
    return prisma.knowledgeDocument.create({
      data: {
        title: data.title,
        content: data.content,
        knowledgeBaseId: baseId,
        source: data.source,
        metadata: {
          summary: data.summary || data.content?.slice(0, 200),
          tags: data.tags || [],
          authorId: data.authorId || 'system',
          status: data.status || 'draft',
        },
      },
    });
  }

  async updateArticle(id: string, data: any): Promise<KnowledgeDocument> {
    const existing = await prisma.knowledgeDocument.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Article not found');
    const meta = (existing.metadata as Record<string, any>) || {};
    return prisma.knowledgeDocument.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        source: data.source,
        metadata: {
          ...meta,
          ...(data.metadata || {}),
          summary: data.summary ?? meta.summary,
          tags: data.tags ?? meta.tags,
          authorId: data.authorId ?? meta.authorId,
          status: data.status ?? meta.status,
        },
      },
    });
  }

  async deleteArticle(id: string): Promise<{ deleted: boolean }> {
    const existing = await prisma.knowledgeDocument.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Article not found');
    await prisma.knowledgeDocument.delete({ where: { id } });
    return { deleted: true };
  }

  async search(query: string): Promise<KnowledgeDocument[]> {
    return prisma.knowledgeDocument.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }
}
