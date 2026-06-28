import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';
import type { MemoryScope } from '@nexora/database';

@Injectable()
export class MemoryCompressionService {
  async compress(scope: MemoryScope, scopeId: string, type: string): Promise<{ compressed: number; summary: string }> {
    const entries = await prisma.memoryEntry.findMany({
      where: { scope, scopeId, type },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (entries.length < 2) return { compressed: 0, summary: 'Not enough entries to compress' };

    const oldEntries = entries.slice(5);
    const keyPoints = oldEntries.map(e => `[${e.createdAt.toISOString().slice(0, 10)}] ${e.content.slice(0, 150)}`).join('\n');

    const ids = oldEntries.map(e => e.id);
    await prisma.memoryEntry.deleteMany({ where: { id: { in: ids } } });

    await prisma.memoryEntry.create({
      data: {
        type: `${type}_compressed`,
        scope,
        scopeId,
        key: `compressed_${type}`,
        content: keyPoints.slice(0, 2000),
        metadata: { compressedCount: oldEntries.length, originalType: type },
        importance: 0.6,
        access: 'PRIVATE',
        tags: ['compressed'],
      },
    });

    return { compressed: oldEntries.length, summary: keyPoints.slice(0, 500) };
  }

  async archiveExpired(scope: MemoryScope, scopeId: string): Promise<number> {
    const result = await prisma.memoryEntry.updateMany({
      where: {
        scope,
        scopeId,
        expiresAt: { lte: new Date() },
      },
      data: { importance: 0.05, tags: { set: ['archived'] } },
    });
    return result.count;
  }
}
