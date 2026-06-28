import { Injectable } from '@nestjs/common';
import { MemoryEngineService } from './memory-engine.service';

export interface MemoryContext {
  sections: { title: string; entries: any[] }[];
  summary: string;
  prompt: string;
}

@Injectable()
export class ContextBuilderService {
  constructor(private readonly memory: MemoryEngineService) {}

  async buildContext(userId: string, options?: {
    projectId?: string; brandId?: string; query?: string; maxEntries?: number;
  }): Promise<MemoryContext> {
    const maxEntries = options?.maxEntries ?? 30;
    const scopes = await this.memory.getUserContextHierarchy(userId, options?.projectId, options?.brandId);
    const allEntries = await this.memory.retrieveForScopes(scopes, { limit: maxEntries });

    const sections: { title: string; entries: any[] }[] = [];
    const scopeLabels: Record<string, string> = {
      USER: 'User Preferences', PROJECT: 'Project Context', BRAND: 'Brand Memory',
      ORGANIZATION: 'Organization Knowledge', WORKSPACE: 'Workspace Context',
      PLATFORM: 'Platform Settings', AGENT: 'Agent Memory',
      CONVERSATION: 'Conversation History', SESSION: 'Session Context',
    };

    const grouped: Record<string, any[]> = {};
    for (const entry of allEntries) {
      const key = entry.scope;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(entry);
    }

    for (const [scope, entries] of Object.entries(grouped)) {
      sections.push({ title: scopeLabels[scope] || scope, entries: entries.slice(0, 10) });
    }

    if (options?.query) {
      const searchResults = await this.memory.searchByContent(options.query, { limit: 5 });
      if (searchResults.length > 0) {
        sections.push({ title: 'Related Memory', entries: searchResults });
      }
    }

    const summary = sections.map(s => `${s.title}: ${s.entries.length} entries`).join('\n');

    const lines: string[] = ['# Memory Context', ''];
    for (const section of sections) {
      lines.push(`## ${section.title}`);
      for (const entry of section.entries) {
        const meta = entry.metadata ? ` [${Object.keys(entry.metadata).join(', ')}]` : '';
        lines.push(`- ${entry.type}: ${entry.content.slice(0, 200)}${meta}`);
      }
      lines.push('');
    }

    const prompt = lines.join('\n');
    return { sections, summary, prompt };
  }
}
