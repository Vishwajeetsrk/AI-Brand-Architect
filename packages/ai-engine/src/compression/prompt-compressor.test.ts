import { describe, it, expect } from 'vitest'
import { PromptCompressor } from './prompt-compressor'

describe('PromptCompressor', () => {
  it('returns messages unchanged when disabled', async () => {
    const compressor = new PromptCompressor({ enabled: false })
    const messages = [{ role: 'user' as const, content: 'Hello world' }]
    const result = await compressor.compress(messages)
    expect(result).toEqual(messages)
  })

  it('returns messages unchanged when under token limit', async () => {
    const compressor = new PromptCompressor({ enabled: true, maxTokens: 10000, compressionRatio: 0.5, summarizeLongestMessages: true })
    const messages = [{ role: 'user' as const, content: 'Short' }]
    const result = await compressor.compress(messages)
    expect(result).toEqual(messages)
  })

  it('compresses long messages', async () => {
    const compressor = new PromptCompressor({ enabled: true, maxTokens: 100, compressionRatio: 0.5, summarizeLongestMessages: true })
    const long = 'A'.repeat(500)
    const messages = [{ role: 'user' as const, content: long }]
    const result = await compressor.compress(messages)
    expect(result.length).toBe(1)
    expect(result[0].content.length).toBeLessThan(long.length)
  })

  it('preserves system messages with higher priority', async () => {
    const compressor = new PromptCompressor({ enabled: true, maxTokens: 200, compressionRatio: 0.8, summarizeLongestMessages: true })
    const systemLong = 'System instruction: ' + 'B'.repeat(200)
    const userLong = 'User message: ' + 'C'.repeat(200)
    const messages = [
      { role: 'system' as const, content: systemLong },
      { role: 'user' as const, content: userLong },
    ]
    const result = await compressor.compress(messages)
    expect(result.some(m => m.role === 'system')).toBe(true)
  })

  it('extracts key sentences from verbose text', async () => {
    const compressor = new PromptCompressor({ enabled: true, maxTokens: 100, compressionRatio: 0.3, summarizeLongestMessages: true })
    const text = 'This is not important. The key finding is critical for the analysis. Another unimportant detail here.'
    const messages = [{ role: 'user' as const, content: text }]
    const result = await compressor.compress(messages)
    expect(result[0].content).toContain('key finding')
  })

  it('updateConfig changes compression behavior', () => {
    const compressor = new PromptCompressor({ enabled: true, maxTokens: 100, compressionRatio: 0.5, summarizeLongestMessages: true })
    compressor.updateConfig({ compressionRatio: 0.9 })
    expect(compressor.getConfig().compressionRatio).toBe(0.9)
  })
})
