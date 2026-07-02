import { describe, it, expect } from 'vitest'
import { SemanticCache } from './semantic-cache'

describe('SemanticCache', () => {
  const messages = [{ role: 'user' as const, content: 'Hello world' }]
  const response = { content: 'Hi there', model: 'gpt-4o', provider: 'openai' as const, latencyMs: 100 }

  it('returns null on cache miss', async () => {
    const cache = new SemanticCache()
    const result = await cache.get(messages, 'gpt-4o')
    expect(result).toBeNull()
  })

  it('stores and retrieves by exact match', async () => {
    const cache = new SemanticCache()
    await cache.set(messages, 'gpt-4o', response)
    const result = await cache.get(messages, 'gpt-4o')
    expect(result).not.toBeNull()
    expect(result!.content).toBe('Hi there')
  })

  it('returns null after TTL expiry', async () => {
    const cache = new SemanticCache({ ttl: 0, maxEntries: 100, similarityThreshold: 0.85 })
    await cache.set(messages, 'gpt-4o', response)
    await new Promise(r => setTimeout(r, 10))
    const result = await cache.get(messages, 'gpt-4o')
    expect(result).toBeNull()
  })

  it('evicts oldest entry when at capacity', async () => {
    const cache = new SemanticCache({ ttl: 60000, maxEntries: 2, similarityThreshold: 0.85 })
    await cache.set([{ role: 'user', content: 'A' }], 'gpt-4o', response)
    await cache.set([{ role: 'user', content: 'B' }], 'gpt-4o', response)
    await cache.set([{ role: 'user', content: 'C' }], 'gpt-4o', response)
    const stats = cache.getStats()
    expect(stats.size).toBe(2)
    expect(stats.evictions).toBe(1)
  })

  it('invalidate by model clears only that model', async () => {
    const cache = new SemanticCache()
    await cache.set([{ role: 'user', content: 'A' }], 'gpt-4o', response)
    await cache.set([{ role: 'user', content: 'B' }], 'claude-3', { ...response, model: 'claude-3' })
    cache.invalidate('gpt-4o')
    expect(await cache.get([{ role: 'user', content: 'A' }], 'gpt-4o')).toBeNull()
    expect(await cache.get([{ role: 'user', content: 'B' }], 'claude-3')).not.toBeNull()
  })

  it('clear resets all state', async () => {
    const cache = new SemanticCache()
    await cache.set(messages, 'gpt-4o', response)
    cache.clear()
    const stats = cache.getStats()
    expect(stats.size).toBe(0)
    expect(stats.hits).toBe(0)
    expect(stats.misses).toBe(0)
  })

  it('getStats returns correct hit/miss rate', async () => {
    const cache = new SemanticCache()
    await cache.get(messages, 'gpt-4o')
    await cache.get(messages, 'gpt-4o')
    await cache.set(messages, 'gpt-4o', response)
    await cache.get(messages, 'gpt-4o')
    const stats = cache.getStats()
    expect(stats.hits).toBe(1)
    expect(stats.misses).toBe(2)
    expect(stats.hitRate).toBeCloseTo(1 / 3, 5)
  })
})
