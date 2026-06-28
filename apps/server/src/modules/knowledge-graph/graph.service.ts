import { Injectable } from '@nestjs/common';
import { prisma, GraphNodeType } from '@nexora/database';

export interface CreateNodeInput {
  type: GraphNodeType;
  name: string;
  label?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  source?: string;
  sourceId?: string;
}

export interface CreateRelationshipInput {
  sourceNodeId: string;
  targetNodeId: string;
  type: string;
  metadata?: Record<string, unknown>;
  weight?: number;
}

export interface GraphNodeResult {
  id: string;
  type: string;
  name: string;
  label: string | null;
  metadata: Record<string, unknown> | null;
  tags: string[];
  source: string | null;
  sourceId: string | null;
  createdAt: Date;
}

export interface GraphRelationshipResult {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: string;
  metadata: Record<string, unknown> | null;
  weight: number;
}

@Injectable()
export class GraphService {
  async createNode(input: CreateNodeInput): Promise<GraphNodeResult> {
    const node = await prisma.graphNode.create({
      data: {
        type: input.type,
        name: input.name,
        label: input.label,
        metadata: input.metadata as any,
        tags: input.tags || [],
        source: input.source,
        sourceId: input.sourceId,
      },
    });
    return this.mapNode(node);
  }

  async getNode(id: string): Promise<GraphNodeResult | null> {
    const node = await prisma.graphNode.findUnique({ where: { id } });
    return node ? this.mapNode(node) : null;
  }

  async findNodes(type?: GraphNodeType, query?: string, tags?: string[]): Promise<GraphNodeResult[]> {
    const nodes = await prisma.graphNode.findMany({
      where: {
        isActive: true,
        ...(type ? { type } : {}),
        ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
        ...(tags && tags.length > 0 ? { tags: { hasSome: tags } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return nodes.map(n => this.mapNode(n));
  }

  async findBySource(source: string, sourceId: string): Promise<GraphNodeResult | null> {
    const node = await prisma.graphNode.findFirst({
      where: { source, sourceId, isActive: true },
    });
    return node ? this.mapNode(node) : null;
  }

  async updateNode(id: string, data: Partial<CreateNodeInput>): Promise<GraphNodeResult> {
    const node = await prisma.graphNode.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.label !== undefined ? { label: data.label } : {}),
        ...(data.metadata ? { metadata: data.metadata as any } : {}),
        ...(data.tags ? { tags: data.tags } : {}),
        version: { increment: 1 },
      },
    });
    return this.mapNode(node);
  }

  async deleteNode(id: string): Promise<void> {
    await prisma.graphNode.update({ where: { id }, data: { isActive: false } });
  }

  async createRelationship(input: CreateRelationshipInput): Promise<GraphRelationshipResult> {
    const rel = await prisma.graphRelationship.create({
      data: {
        sourceNodeId: input.sourceNodeId,
        targetNodeId: input.targetNodeId,
        type: input.type,
        metadata: input.metadata as any,
        weight: input.weight ?? 1.0,
      },
    });
    return this.mapRelationship(rel);
  }

  async getRelationships(nodeId: string, direction: 'outgoing' | 'incoming' | 'both' = 'both', type?: string): Promise<GraphRelationshipResult[]> {
    const where: any = {
      isActive: true,
      ...(type ? { type } : {}),
    };
    if (direction === 'outgoing') where.sourceNodeId = nodeId;
    else if (direction === 'incoming') where.targetNodeId = nodeId;
    else where.OR = [{ sourceNodeId: nodeId }, { targetNodeId: nodeId }];

    const rels = await prisma.graphRelationship.findMany({ where, orderBy: { createdAt: 'desc' } });
    return rels.map(r => this.mapRelationship(r));
  }

  async getNeighbors(nodeId: string, maxDepth: number = 1): Promise<{ nodes: GraphNodeResult[]; relationships: GraphRelationshipResult[] }> {
    const visited = new Set<string>();
    const nodes: GraphNodeResult[] = [];
    const relationships: GraphRelationshipResult[] = [];
    let currentLevel = new Set([nodeId]);
    visited.add(nodeId);

    for (let depth = 0; depth < maxDepth && currentLevel.size > 0; depth++) {
      const rels = await prisma.graphRelationship.findMany({
        where: {
          isActive: true,
          OR: [
            { sourceNodeId: { in: [...currentLevel] } },
            { targetNodeId: { in: [...currentLevel] } },
          ],
        },
      });

      const nextLevel = new Set<string>();
      for (const rel of rels) {
        relationships.push(this.mapRelationship(rel));
        if (!visited.has(rel.sourceNodeId)) { visited.add(rel.sourceNodeId); nextLevel.add(rel.sourceNodeId); }
        if (!visited.has(rel.targetNodeId)) { visited.add(rel.targetNodeId); nextLevel.add(rel.targetNodeId); }
      }

      if (nextLevel.size > 0) {
        const neighborNodes = await prisma.graphNode.findMany({
          where: { id: { in: [...nextLevel] }, isActive: true },
        });
        for (const n of neighborNodes) nodes.push(this.mapNode(n));
      }

      currentLevel = nextLevel;
    }

    const rootNode = await prisma.graphNode.findUnique({ where: { id: nodeId } });
    if (rootNode) nodes.unshift(this.mapNode(rootNode));

    return { nodes, relationships };
  }

  async findPath(fromId: string, toId: string, maxDepth: number = 5): Promise<{ nodes: GraphNodeResult[]; relationships: GraphRelationshipResult[] } | null> {
    const queue: { nodeId: string; path: string[]; relPath: string[] }[] = [{ nodeId: fromId, path: [fromId], relPath: [] }];
    const visited = new Set([fromId]);

    for (let depth = 0; depth < maxDepth && queue.length > 0; depth++) {
      const levelSize = queue.length;
      for (let i = 0; i < levelSize; i++) {
        const current = queue.shift()!;

        const rels = await prisma.graphRelationship.findMany({
          where: {
            isActive: true,
            OR: [
              { sourceNodeId: current.nodeId },
              { targetNodeId: current.nodeId },
            ],
          },
        });

        for (const rel of rels) {
          const nextId = rel.sourceNodeId === current.nodeId ? rel.targetNodeId : rel.sourceNodeId;
          if (nextId === toId) {
            const fullPath = [...current.path, nextId];
            const fullRelPath = [...current.relPath, rel.id];
            const pathNodes = await prisma.graphNode.findMany({
              where: { id: { in: fullPath } },
            });
            const pathRels = await prisma.graphRelationship.findMany({
              where: { id: { in: fullRelPath } },
            });
            return {
              nodes: pathNodes.map(n => this.mapNode(n)),
              relationships: pathRels.map(r => this.mapRelationship(r)),
            };
          }
          if (!visited.has(nextId)) {
            visited.add(nextId);
            queue.push({ nodeId: nextId, path: [...current.path, nextId], relPath: [...current.relPath, rel.id] });
          }
        }
      }
    }

    return null;
  }

  async upsertFromSource(input: CreateNodeInput): Promise<GraphNodeResult> {
    const existing = input.source ? await prisma.graphNode.findFirst({
      where: { source: input.source, sourceId: input.sourceId, isActive: true },
    }) : null;

    if (existing) {
      return this.updateNode(existing.id, input);
    }
    return this.createNode(input);
  }

  async deleteRelationship(id: string): Promise<void> {
    await prisma.graphRelationship.update({ where: { id }, data: { isActive: false } });
  }

  async getStats(): Promise<{ nodeCount: number; relationshipCount: number; nodeTypeCounts: Record<string, number>; relationshipTypeCounts: Record<string, number> }> {
    const nodes = await prisma.graphNode.findMany({ where: { isActive: true }, select: { type: true } });
    const rels = await prisma.graphRelationship.findMany({ where: { isActive: true }, select: { type: true } });

    const nodeTypeCounts: Record<string, number> = {};
    for (const n of nodes) nodeTypeCounts[n.type] = (nodeTypeCounts[n.type] || 0) + 1;

    const relationshipTypeCounts: Record<string, number> = {};
    for (const r of rels) relationshipTypeCounts[r.type] = (relationshipTypeCounts[r.type] || 0) + 1;

    return {
      nodeCount: nodes.length,
      relationshipCount: rels.length,
      nodeTypeCounts,
      relationshipTypeCounts,
    };
  }

  private mapNode(n: any): GraphNodeResult {
    return {
      id: n.id, type: n.type, name: n.name, label: n.label,
      metadata: n.metadata as Record<string, unknown> | null,
      tags: n.tags, source: n.source, sourceId: n.sourceId,
      createdAt: n.createdAt,
    };
  }

  private mapRelationship(r: any): GraphRelationshipResult {
    return {
      id: r.id, sourceNodeId: r.sourceNodeId, targetNodeId: r.targetNodeId,
      type: r.type, metadata: r.metadata as Record<string, unknown> | null,
      weight: r.weight,
    };
  }
}
