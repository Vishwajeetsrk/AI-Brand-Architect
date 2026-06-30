import { describe, it, expect } from 'vitest'
import { SharedAgentMemory } from './shared-agent-memory'
import { CommunicationBus } from './communication-bus'
import { MemoryStore } from '../memory/memory-store'

describe('SharedAgentMemory', () => {
  it('share stores an entry', async () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    await memory.share('agent-1', 'brand:colors', { primary: '#6366F1' }, 'team', ['brand', 'design'])
    const entry = memory.recall('brand:colors')
    expect(entry).toBeDefined()
    expect(entry!.value).toEqual({ primary: '#6366F1' })
    expect(entry!.ownerId).toBe('agent-1')
    expect(entry!.scope).toBe('team')
    expect(entry!.tags).toEqual(['brand', 'design'])
  })

  it('recall returns undefined for unknown key', () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    expect(memory.recall('unknown')).toBeUndefined()
  })

  it('searchByScope filters by scope', async () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    await memory.share('a1', 'key1', 'val1', 'agent')
    await memory.share('a1', 'key2', 'val2', 'team')
    await memory.share('a1', 'key3', 'val3', 'goal')
    expect(memory.searchByScope('team')).toHaveLength(1)
    expect(memory.searchByScope('agent')).toHaveLength(1)
  })

  it('searchByTag filters by tag', async () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    await memory.share('a1', 'k1', 'v1', 'team', ['urgent'])
    await memory.share('a1', 'k2', 'v2', 'team', ['normal'])
    expect(memory.searchByTag('urgent')).toHaveLength(1)
  })

  it('searchByOwner filters by owner', async () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    await memory.share('a1', 'k1', 'v1')
    await memory.share('a2', 'k2', 'v2')
    expect(memory.searchByOwner('a1')).toHaveLength(1)
    expect(memory.searchByOwner('a2')).toHaveLength(1)
  })

  it('search finds entries by key, tag, or value content', async () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    await memory.share('a1', 'brand:colors', { hex: '#6366F1' }, 'team', ['design'])
    const results = memory.search('color')
    expect(results.length).toBeGreaterThan(0)
  })

  it('forget removes an entry', async () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    await memory.share('a1', 'temp-key', 'temp')
    expect(memory.forget('temp-key')).toBe(true)
    expect(memory.recall('temp-key')).toBeUndefined()
  })

  it('clear removes all entries', async () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    await memory.share('a1', 'k1', 'v1')
    await memory.share('a1', 'k2', 'v2')
    memory.clear()
    expect(memory.getStats().total).toBe(0)
  })

  it('clear with scope only removes matching entries', async () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    await memory.share('a1', 'k1', 'v1', 'agent')
    await memory.share('a1', 'k2', 'v2', 'team')
    memory.clear('agent')
    expect(memory.recall('k2')).toBeDefined()
    expect(memory.recall('k1')).toBeUndefined()
  })

  it('getStats returns correct counts', async () => {
    const bus = new CommunicationBus()
    const memory = new SharedAgentMemory(bus, new MemoryStore())
    await memory.share('a1', 'k1', 'v1', 'team')
    await memory.share('a1', 'k2', 'v2', 'goal')
    const stats = memory.getStats()
    expect(stats.total).toBe(2)
    expect(stats.byScope['team']).toBe(1)
    expect(stats.byScope['goal']).toBe(1)
    expect(stats.byOwner['a1']).toBe(2)
  })
})
