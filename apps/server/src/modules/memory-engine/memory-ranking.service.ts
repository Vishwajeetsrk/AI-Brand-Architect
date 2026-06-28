import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';
import type { MemoryScope } from '@nexora/database';

export interface RankingOptions {
  recencyWeight?: number;
  importanceWeight?: number;
  relevanceWeight?: number;
  limit?: number;
}

@Injectable()
export class MemoryRankingService {
  async rank(scope: MemoryScope, scopeId: string, query?: string, options?: RankingOptions): Promise<any[]> {
    const entries = await prisma.memoryEntry.findMany({
      where: { scope, scopeId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const recencyW = options?.recencyWeight ?? 0.3;
    const importanceW = options?.importanceWeight ?? 0.5;
    const relevanceW = options?.relevanceWeight ?? 0.2;
    const limit = options?.limit ?? 20;

    const scored = entries.map(e => {
      const ageHours = (Date.now() - e.createdAt.getTime()) / 3600000;
      const recencyScore = Math.max(0, 1 - ageHours / (24 * 30));
      const importanceScore = e.importance;
      const relevanceScore = query ? this.textRelevance(e.content + ' ' + (e.key || ''), query) : 0.5;

      const total = recencyScore * recencyW + importanceScore * importanceW + relevanceScore * relevanceW;
      return { ...e, scores: { recency: recencyScore, importance: importanceScore, relevance: relevanceScore }, totalScore: total };
    });

    return scored.sort((a, b) => b.totalScore - a.totalScore).slice(0, limit);
  }

  async recordFeedback(memoryId: string, helpful: boolean): Promise<void> {
    const entry = await prisma.memoryEntry.findUnique({ where: { id: memoryId } });
    if (!entry) return;

    const delta = helpful ? 0.1 : -0.1;
    await prisma.memoryEntry.update({
      where: { id: memoryId },
      data: { importance: Math.max(0, Math.min(1, entry.importance + delta)) },
    });
  }

  private textRelevance(text: string, query: string): number {
    const t = text.toLowerCase();
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return 0;

    const matches = words.filter(w => t.includes(w)).length;
    return matches / words.length;
  }
}
