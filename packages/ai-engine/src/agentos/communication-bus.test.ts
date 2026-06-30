import { describe, it, expect, vi } from 'vitest'
import { CommunicationBus } from './communication-bus'

describe('CommunicationBus', () => {
  it('subscribe and publish triggers handler', async () => {
    const bus = new CommunicationBus()
    const handler = vi.fn()
    bus.subscribe('test:topic', handler)
    await bus.publish({
      id: 'msg-1', fromAgentId: 'agent-1', topic: 'test:topic',
      type: 'broadcast', payload: { data: 123 }, priority: 50, timestamp: Date.now(),
    })
    expect(handler).toHaveBeenCalled()
  })

  it('subscribe returns an unsubscribe function', async () => {
    const bus = new CommunicationBus()
    const handler = vi.fn()
    const unsubscribe = bus.subscribe('test:topic', handler)
    unsubscribe()
    await bus.publish({
      id: 'msg-2', fromAgentId: 'agent-1', topic: 'test:topic',
      type: 'broadcast', payload: {}, priority: 50, timestamp: Date.now(),
    })
    expect(handler).not.toHaveBeenCalled()
  })

  it('subscribeToAgent listens for agent-specific messages', async () => {
    const bus = new CommunicationBus()
    const handler = vi.fn()
    bus.subscribeToAgent('agent-1', handler)
    await bus.publish({
      id: 'msg-3', fromAgentId: 'system', toAgentId: 'agent-1', topic: 'agent:agent-1',
      type: 'request', payload: {}, priority: 50, timestamp: Date.now(),
    })
    expect(handler).toHaveBeenCalled()
  })

  it('request sends a message and waits for response', async () => {
    const bus = new CommunicationBus()
    bus.subscribeToAgent('agent-1', async (msg) => {
      if (msg.type === 'request') {
        await bus.publish({
          id: 'resp-1', fromAgentId: 'agent-1',
          topic: `agent:agent-1`, type: 'response', payload: { result: 'ok' },
          replyTo: msg.id, priority: 50, timestamp: Date.now(),
        })
      }
    })
    const response = await bus.request('agent-1', 'test', { query: 'hello' })
    expect(response.payload).toEqual({ result: 'ok' })
  })

  it('request times out after 30s', async () => {
    const bus = new CommunicationBus(100)
    const response = await bus.request('nonexistent', 'test', {})
    expect(response.type).toBe('error')
  }, 35000)

  it('delegate sends delegation message and waits for result', async () => {
    const bus = new CommunicationBus()
    bus.subscribeToAgent('agent-2', async (msg) => {
      if (msg.type === 'delegation') {
        await bus.publish({
          id: 'del-resp', fromAgentId: 'agent-2', toAgentId: 'agent-1',
          topic: 'delegation:result:agent-2', type: 'response',
          payload: { done: true }, replyTo: msg.id, priority: 75, timestamp: Date.now(),
        })
      }
    })
    const result = await bus.delegate('agent-1', 'agent-2', 'do something')
    expect(result.payload).toEqual({ done: true })
  })

  it('broadcast sends to all broadcast subscribers', async () => {
    const bus = new CommunicationBus()
    const handler = vi.fn()
    bus.subscribe('broadcast', handler)
    bus.broadcast('agent-1', 'broadcast', { alert: 'test' })
    await new Promise(r => setTimeout(r, 50))
    expect(handler).toHaveBeenCalled()
  })

  it('getHistory returns recent messages', async () => {
    const bus = new CommunicationBus(100)
    await bus.publish({
      id: 'h1', fromAgentId: 'a1', topic: 'test', type: 'broadcast',
      payload: {}, priority: 50, timestamp: Date.now(),
    })
    expect(bus.getHistory().length).toBe(1)
    expect(bus.getHistory('test').length).toBe(1)
  })

  it('getHistoryForAgent filters by agent involvement', async () => {
    const bus = new CommunicationBus(100)
    await bus.publish({
      id: 'm1', fromAgentId: 'a1', toAgentId: 'a2', topic: 'test',
      type: 'request', payload: {}, priority: 50, timestamp: Date.now(),
    })
    expect(bus.getHistoryForAgent('a1').length).toBe(1)
    expect(bus.getHistoryForAgent('a2').length).toBe(1)
    expect(bus.getHistoryForAgent('a3').length).toBe(0)
  })

  it('clearHistory empties the history', async () => {
    const bus = new CommunicationBus(100)
    await bus.publish({
      id: 'clr', fromAgentId: 'a1', topic: 'test', type: 'broadcast',
      payload: {}, priority: 50, timestamp: Date.now(),
    })
    bus.clearHistory()
    expect(bus.getHistory().length).toBe(0)
  })
})
