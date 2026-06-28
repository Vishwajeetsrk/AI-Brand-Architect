import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';
import type { MemoryScope, MemoryAccess } from '@nexora/database';

export interface StoreMemoryInput {
  type: string;
  scope: MemoryScope;
  scopeId: string;
  key?: string;
  content: string;
  metadata?: Record<string, unknown>;
  importance?: number;
  access?: MemoryAccess;
  tags?: string[];
  source?: string;
  expiresAt?: Date;
}

export interface MemoryResult {
  id: string;
  type: string;
  scope: string;
  scopeId: string;
  key: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  importance: number;
  access: string;
  tags: string[];
  source: string | null;
  createdAt: Date;
}

@Injectable()
export class MemoryEngineService {
  async store(input: StoreMemoryInput): Promise<MemoryResult> {
    const entry = await prisma.memoryEntry.create({
      data: {
        type: input.type,
        scope: input.scope,
        scopeId: input.scopeId,
        key: input.key,
        content: input.content,
        metadata: input.metadata as any,
        importance: input.importance ?? 0.5,
        access: input.access ?? 'PRIVATE',
        tags: input.tags || [],
        source: input.source,
        expiresAt: input.expiresAt,
      },
    });
    return this.mapEntry(entry);
  }

  async get(id: string): Promise<MemoryResult | null> {
    const entry = await prisma.memoryEntry.findUnique({ where: { id } });
    return entry ? this.mapEntry(entry) : null;
  }

  async update(id: string, data: Partial<StoreMemoryInput>): Promise<MemoryResult> {
    const entry = await prisma.memoryEntry.update({
      where: { id },
      data: {
        ...(data.content ? { content: data.content } : {}),
        ...(data.metadata ? { metadata: data.metadata as any } : {}),
        ...(data.importance !== undefined ? { importance: data.importance } : {}),
        ...(data.key ? { key: data.key } : {}),
        ...(data.tags ? { tags: data.tags } : {}),
        ...(data.expiresAt !== undefined ? { expiresAt: data.expiresAt } : {}),
      },
    });
    return this.mapEntry(entry);
  }

  async delete(id: string): Promise<void> {
    await prisma.memoryEntry.delete({ where: { id } });
  }

  async retrieve(scope: MemoryScope, scopeId: string, options?: {
    type?: string;
    key?: string;
    limit?: number;
    minImportance?: number;
  }): Promise<MemoryResult[]> {
    const entries = await prisma.memoryEntry.findMany({
      where: {
        scope,
        scopeId,
        ...(options?.type ? { type: options.type } : {}),
        ...(options?.key ? { key: options.key } : {}),
        ...(options?.minImportance ? { importance: { gte: options.minImportance } } : {}),
        ...(options?.type === 'short_term' ? {} : { expiresAt: null }),
      },
      orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }],
      take: options?.limit ?? 50,
    });
    return entries.map(e => this.mapEntry(e));
  }

  async retrieveForScopes(scopes: { scope: MemoryScope; scopeId: string }[], options?: {
    type?: string; limit?: number; minImportance?: number;
  }): Promise<MemoryResult[]> {
    const results: MemoryResult[] = [];
    for (const s of scopes) {
      const entries = await this.retrieve(s.scope, s.scopeId, options);
      results.push(...entries);
    }
    return results;
  }

  async searchByContent(query: string, options?: {
    scope?: MemoryScope; scopeId?: string; type?: string; limit?: number;
  }): Promise<MemoryResult[]> {
    const entries = await prisma.memoryEntry.findMany({
      where: {
        content: { contains: query, mode: 'insensitive' },
        ...(options?.scope ? { scope: options.scope } : {}),
        ...(options?.scopeId ? { scopeId: options.scopeId } : {}),
        ...(options?.type ? { type: options.type } : {}),
      },
      orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }],
      take: options?.limit ?? 20,
    });
    return entries.map(e => this.mapEntry(e));
  }

  async getUserContextHierarchy(userId: string, projectId?: string, brandId?: string): Promise<{ scope: MemoryScope; scopeId: string }[]> {
    const scopes: { scope: MemoryScope; scopeId: string }[] = [
      { scope: 'USER', scopeId: userId },
    ];

    if (projectId) scopes.push({ scope: 'PROJECT', scopeId: projectId });
    if (brandId) scopes.push({ scope: 'BRAND', scopeId: brandId });

    const memberships = await prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true },
    });
    for (const m of memberships) {
      scopes.push({ scope: 'ORGANIZATION', scopeId: m.organizationId });
    }

    return scopes;
  }

  async countByScope(scope: MemoryScope, scopeId: string): Promise<number> {
    return prisma.memoryEntry.count({ where: { scope, scopeId } });
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.memoryEntry.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
    return result.count;
  }

  private mapEntry(e: any): MemoryResult {
    return {
      id: e.id, type: e.type, scope: e.scope, scopeId: e.scopeId,
      key: e.key, content: e.content,
      metadata: e.metadata as Record<string, unknown> | null,
      importance: e.importance, access: e.access, tags: e.tags,
      source: e.source, createdAt: e.createdAt,
    };
  }
}
