import { Injectable } from '@nestjs/common';
import { GraphService } from './graph.service';
import { EntityResolverService } from './entity-resolver.service';

export interface ContextAssembly {
  primary: any;
  related: any[];
  relationships: any[];
  summary: string;
  prompt: string;
}

@Injectable()
export class ContextBuilderService {
  constructor(
    private readonly graph: GraphService,
    private readonly resolver: EntityResolverService,
  ) {}

  async buildContext(query: string, options?: { depth?: number; maxNodes?: number; types?: string[] }): Promise<ContextAssembly> {
    const depth = options?.depth ?? 2;
    const maxNodes = options?.maxNodes ?? 30;

    const resolved = await this.resolver.resolveEntity(query);
    if (!resolved) {
      const nodes = await this.graph.findNodes(undefined, query);
      if (nodes.length === 0) {
        return { primary: null, related: [], relationships: [], summary: `No graph context found for: ${query}`, prompt: `No context available for "${query}" in the knowledge graph.` };
      }
      const expanded = await this.graph.getNeighbors(nodes[0].id, depth);
      return this.assemble(nodes[0], expanded.nodes.slice(0, maxNodes), expanded.relationships, query);
    }

    const expanded = await this.graph.getNeighbors(resolved.node.id, depth);
    return this.assemble(resolved.node, expanded.nodes.slice(0, maxNodes), expanded.relationships, query);
  }

  async buildPrompt(userQuery: string, contextQuery?: string): Promise<string> {
    const ctx = await this.buildContext(contextQuery || userQuery);
    return ctx.prompt;
  }

  private assemble(primary: any, related: any[], relationships: any[], query: string): ContextAssembly {
    const relSummary = relationships.map(r => {
      const source = related.find(n => n.id === r.sourceNodeId)?.name || r.sourceNodeId;
      const target = related.find(n => n.id === r.targetNodeId)?.name || r.targetNodeId;
      return `[${source}] --${r.type}--> [${target}]`;
    });

    const summary = [
      `Primary entity: ${primary?.name || 'None'} (${primary?.type || 'N/A'})`,
      `Related entities: ${related.length}`,
      `Relationships: ${relationships.length}`,
      ...relSummary.slice(0, 20),
    ].join('\n');

    const contextLines: string[] = [];
    if (primary) {
      contextLines.push(`# PRIMARY: ${primary.name} (${primary.type})`);
      if (primary.label) contextLines.push(`Label: ${primary.label}`);
      if (primary.tags?.length) contextLines.push(`Tags: ${primary.tags.join(', ')}`);
      contextLines.push('');
    }

    if (relSummary.length > 0) {
      contextLines.push('## Knowledge Graph Context');
      contextLines.push(...relSummary.slice(0, 30));
      contextLines.push('');
    }

    if (related.length > 0) {
      contextLines.push('## Related Entities');
      for (const n of related.slice(0, 20)) {
        contextLines.push(`- ${n.name} (${n.type})${n.label ? ': ' + n.label : ''}`);
      }
      contextLines.push('');
    }

    contextLines.push(`## User Query`);
    contextLines.push(query);

    const prompt = [
      `You have access to the following knowledge graph context to answer the user's request.`,
      `Use this context to provide accurate, grounded responses.`,
      ``,
      ...contextLines,
    ].join('\n');

    return { primary, related, relationships, summary, prompt };
  }
}
