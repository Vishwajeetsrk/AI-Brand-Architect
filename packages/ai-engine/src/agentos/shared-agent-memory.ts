import { AgentMessage } from './agentos-types';
import { CommunicationBus } from './communication-bus';
import { MemoryStore } from '../memory/memory-store';

export interface SharedMemoryEntry {
  key: string;
  value: unknown;
  ownerId: string;
  scope: 'agent' | 'team' | 'goal';
  tags: string[];
  timestamp: number;
  ttl?: number;
}

export class SharedAgentMemory {
  private store: Map<string, SharedMemoryEntry> = new Map();
  private bus: CommunicationBus;
  private memoryStore: MemoryStore;

  constructor(bus: CommunicationBus, memoryStore: MemoryStore) {
    this.bus = bus;
    this.memoryStore = memoryStore;

    this.bus.subscribe('memory:share', async (msg: AgentMessage) => {
      const payload = msg.payload as { key: string; value: unknown; scope: string; tags?: string[] };
      await this.share(msg.fromAgentId, payload.key, payload.value, payload.scope as SharedMemoryEntry['scope'], payload.tags);
    });

    this.bus.subscribe('memory:request', async (msg: AgentMessage) => {
      const payload = msg.payload as { key: string };
      const entry = this.recall(payload.key);
      if (entry) {
        this.bus.publish({
          id: crypto.randomUUID(),
          fromAgentId: 'shared-memory',
          toAgentId: msg.fromAgentId,
          topic: `memory:response:${msg.id}`,
          type: 'response',
          payload: entry,
          priority: 50,
          timestamp: Date.now(),
        });
      }
    });
  }

  async share(agentId: string, key: string, value: unknown, scope: SharedMemoryEntry['scope'] = 'team', tags: string[] = []): Promise<void> {
    const entry: SharedMemoryEntry = {
      key,
      value,
      ownerId: agentId,
      scope,
      tags,
      timestamp: Date.now(),
    };
    this.store.set(key, entry);
    this.evictExpired();

    await this.memoryStore.store({
      id: `shared:${key}`,
      type: 'semantic',
      content: `[Shared by ${agentId}] ${JSON.stringify(value)}`,
      metadata: { key, ownerId: agentId, scope, tags, source: 'shared-agent-memory' },
      ttl: 3600000,
    });
  }

  recall(key: string): SharedMemoryEntry | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (this.isExpired(entry)) {
      this.store.delete(key);
      return undefined;
    }
    return entry;
  }

  searchByScope(scope: SharedMemoryEntry['scope']): SharedMemoryEntry[] {
    this.evictExpired();
    return Array.from(this.store.values()).filter(e => e.scope === scope);
  }

  searchByTag(tag: string): SharedMemoryEntry[] {
    this.evictExpired();
    return Array.from(this.store.values()).filter(e => e.tags.includes(tag));
  }

  searchByOwner(agentId: string): SharedMemoryEntry[] {
    this.evictExpired();
    return Array.from(this.store.values()).filter(e => e.ownerId === agentId);
  }

  search(query: string): SharedMemoryEntry[] {
    this.evictExpired();
    const lower = query.toLowerCase();
    return Array.from(this.store.values()).filter(e =>
      e.key.toLowerCase().includes(lower) ||
      e.tags.some(t => t.toLowerCase().includes(lower)) ||
      JSON.stringify(e.value).toLowerCase().includes(lower),
    );
  }

  forget(key: string): boolean {
    return this.store.delete(key);
  }

  clear(scope?: SharedMemoryEntry['scope']): void {
    if (scope) {
      for (const [key, entry] of this.store) {
        if (entry.scope === scope) this.store.delete(key);
      }
    } else {
      this.store.clear();
    }
  }

  getStats(): { total: number; byScope: Record<string, number>; byOwner: Record<string, number> } {
    this.evictExpired();
    const byScope: Record<string, number> = {};
    const byOwner: Record<string, number> = {};
    for (const entry of this.store.values()) {
      byScope[entry.scope] = (byScope[entry.scope] || 0) + 1;
      byOwner[entry.ownerId] = (byOwner[entry.ownerId] || 0) + 1;
    }
    return { total: this.store.size, byScope, byOwner };
  }

  private isExpired(entry: SharedMemoryEntry): boolean {
    if (!entry.ttl) return false;
    return Date.now() > entry.timestamp + entry.ttl;
  }

  private evictExpired(): void {
    for (const [key, entry] of this.store) {
      if (this.isExpired(entry)) this.store.delete(key);
    }
  }
}
