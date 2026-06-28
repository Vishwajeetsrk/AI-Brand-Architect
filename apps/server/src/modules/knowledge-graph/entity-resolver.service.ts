import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { GraphService } from './graph.service';

@Injectable()
export class EntityResolverService {
  constructor(private readonly graph: GraphService) {}

  async resolveEntity(name: string, type?: string): Promise<{ node: any; confidence: number } | null> {
    const exact = await prisma.graphNode.findFirst({
      where: { name: { equals: name, mode: 'insensitive' }, ...(type ? { type: type as any } : {}), isActive: true },
    });
    if (exact) return { node: this.graph['mapNode'](exact), confidence: 1.0 };

    const fuzzy = await prisma.graphNode.findMany({
      where: { ...(type ? { type: type as any } : {}), isActive: true },
      select: { id: true, name: true, type: true },
      take: 50,
    });

    const scored = fuzzy.map(n => ({
      node: n,
      score: this.similarity(name.toLowerCase(), n.name.toLowerCase()),
    }))
      .filter(x => x.score > 0.4)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
      const aliases = await prisma.graphRelationship.findMany({
        where: { type: 'ALIAS', targetNodeId: undefined as any },
        include: { sourceNode: true },
      });
      for (const alias of aliases) {
        if (alias.sourceNode.name.toLowerCase().includes(name.toLowerCase())) {
          const target = await prisma.graphNode.findUnique({ where: { id: alias.targetNodeId } });
          if (target) return { node: this.graph['mapNode'](target), confidence: 0.7 };
        }
      }
      return null;
    }

    const best = await prisma.graphNode.findUnique({ where: { id: scored[0].node.id } });
    return best ? { node: this.graph['mapNode'](best), confidence: scored[0].score } : null;
  }

  async findOrCreateAlias(canonicalId: string, aliasName: string, aliasSource: string): Promise<{ node: any; isNew: boolean }> {
    const existingAlias = await prisma.graphRelationship.findFirst({
      where: { type: 'ALIAS', sourceNode: { name: aliasName } },
    });
    if (existingAlias) {
      const node = await prisma.graphNode.findUnique({ where: { id: existingAlias.targetNodeId } });
      if (node) return { node: this.graph['mapNode'](node), isNew: false };
    }

    const aliasNode = await this.graph.createNode({
      type: 'CONCEPT',
      name: aliasName,
      tags: ['alias'],
      source: aliasSource,
    });

    await this.graph.createRelationship({
      sourceNodeId: aliasNode.id,
      targetNodeId: canonicalId,
      type: 'ALIAS',
      weight: 0.5,
    });

    return { node: aliasNode, isNew: true };
  }

  async deduplicate(canonicalId: string, duplicateIds: string[]): Promise<void> {
    for (const dupId of duplicateIds) {
      const existing = await prisma.graphRelationship.findFirst({
        where: { sourceNodeId: dupId, targetNodeId: canonicalId, type: 'MERGE' },
      });
      if (!existing) {
        await this.graph.createRelationship({
          sourceNodeId: dupId,
          targetNodeId: canonicalId,
          type: 'MERGE',
          weight: 0.3,
        });
      }
      await prisma.graphNode.update({ where: { id: dupId }, data: { isActive: false } });
    }
  }

  private similarity(a: string, b: string): number {
    if (a === b) return 1.0;
    if (a.includes(b) || b.includes(a)) return 0.8;
    const dist = this.levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen > 0 ? 1 - dist / maxLen : 0;
  }

  private levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }
}
