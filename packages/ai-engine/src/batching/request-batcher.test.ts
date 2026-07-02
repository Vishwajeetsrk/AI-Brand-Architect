import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RequestBatcher } from './request-batcher'
import { LLMResponse } from '../types'

vi.mock('../llm/provider-factory', () => ({
  getProvider: vi.fn(() => ({
    generateText: vi.fn((messages: any, opts: any) => Promise.resolve({
      content: `Echo: ${messages[0].content}`,
      model: opts?.model || 'gpt-4o',
      provider: 'openai',
      latencyMs: 5,
    } as LLMResponse)),
  })),
}))

describe('RequestBatcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('enqueue returns a response for each request', async () => {
    const batcher = new RequestBatcher({ batchWindow: 20, maxBatchSize: 10, enabled: true })
    const promise1 = batcher.enqueue([{ role: 'user', content: 'Hi' }], 'gpt-4o', 'openai', 'test-key')
    const promise2 = batcher.enqueue([{ role: 'user', content: 'Hello' }], 'gpt-4o', 'openai', 'test-key')
    batcher.flushAll()
    const [r1, r2] = await Promise.all([promise1, promise2])
    expect(r1.content).toBeTruthy()
    expect(r2.content).toBeTruthy()
  })

  it('bypasses batching when disabled', async () => {
    const batcher = new RequestBatcher({ batchWindow: 50, maxBatchSize: 10, enabled: false })
    const result = await batcher.enqueue([{ role: 'user', content: 'Hi' }], 'gpt-4o', 'openai', 'test-key')
    expect(result.content).toBeTruthy()
  })

  it('flushes when maxBatchSize is reached', async () => {
    const batcher = new RequestBatcher({ batchWindow: 5000, maxBatchSize: 3, enabled: true })
    const promises = Array.from({ length: 3 }, (_, i) =>
      batcher.enqueue([{ role: 'user', content: `Msg ${i}` }], 'gpt-4o', 'openai', 'test-key'),
    )
    const results = await Promise.all(promises)
    expect(results).toHaveLength(3)
  })
})
