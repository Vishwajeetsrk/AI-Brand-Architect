import { describe, it, expect, vi } from 'vitest'
import { CoordinationEngine } from './coordination-engine'
import { CommunicationBus } from './communication-bus'
import { AgentRegistry } from './agent-registry'
import { AgentProfile, CoordinationStrategy } from './agentos-types'

function makeAgent(id: string, role: string = 'executor'): AgentProfile {
  return {
    id, name: `Agent ${id}`, role: role as any, description: '', systemPrompt: '',
    skills: [], capabilities: ['test'],
    model: { provider: 'openai', model: 'gpt-4o' },
    maxConcurrency: 1, safetyLevel: 'moderate', ownerId: 'user-1',
    status: 'idle', version: 1, createdAt: Date.now(), updatedAt: Date.now(),
    lastHeartbeat: Date.now(), metadata: {},
  }
}

async function setupEngine(agentIds: string[] = ['a1', 'a2']) {
  const bus = new CommunicationBus()
  const registry = new AgentRegistry()
  for (const id of agentIds) {
    registry.register(makeAgent(id))
    bus.subscribeToAgent(id, async (msg) => {
      if (msg.type === 'request') {
        await bus.publish({
          id: `resp-${msg.id}`, fromAgentId: id,
          topic: `agent:${id}`, type: 'response',
          payload: { result: `done by ${id}`, qualityScore: 0.8 },
          replyTo: msg.id, priority: 50, timestamp: Date.now(),
        })
      }
    })
  }
  return { bus, registry, engine: new CoordinationEngine(bus, registry) }
}

describe('CoordinationEngine', () => {
  it('createPlan generates steps for sequential strategy', async () => {
    const { engine } = await setupEngine()
    const plan = await engine.createPlan('sequential', 'Test goal', ['a1', 'a2'])
    expect(plan.strategy).toBe('sequential')
    expect(plan.steps.length).toBe(2)
    expect(plan.agents).toEqual(['a1', 'a2'])
    expect(plan.status).toBe('pending')
  })

  it('getPlan returns undefined for unknown plan', () => {
    const bus = new CommunicationBus()
    const registry = new AgentRegistry()
    const engine = new CoordinationEngine(bus, registry)
    expect(engine.getPlan('nonexistent')).toBeUndefined()
  })

  const strategies: CoordinationStrategy[] = ['sequential', 'parallel', 'swarm', 'pipeline', 'hierarchy', 'debate', 'consensus']

  for (const strategy of strategies) {
    it(`executePlan with ${strategy} strategy returns results`, async () => {
      const { engine } = await setupEngine()
      const plan = await engine.createPlan(strategy, 'Test goal', ['a1', 'a2'])
      const results = await engine.executePlan(plan.id)
      expect(results.length).toBeGreaterThan(0)
    })
  }

  it('executePlan throws for unknown plan', async () => {
    const bus = new CommunicationBus()
    const registry = new AgentRegistry()
    const engine = new CoordinationEngine(bus, registry)
    await expect(engine.executePlan('unknown')).rejects.toThrow('Coordination plan not found')
  })

  it('creates different step structures for different strategies', async () => {
    const { engine } = await setupEngine()
    const seq = await engine.createPlan('sequential', 'Goal', ['a1', 'a2'])
    const par = await engine.createPlan('parallel', 'Goal', ['a1', 'a2'])
    expect(seq.steps[0].dependsOn).toEqual([])
    expect(seq.steps[1].dependsOn).toEqual(['step-0'])
    expect(par.steps[0].dependsOn).toEqual([])
    expect(par.steps[1].dependsOn).toEqual([])
  })

  it('debate plan collects multiple perspectives', async () => {
    const { engine } = await setupEngine()
    const plan = await engine.createPlan('debate', 'Best approach', ['a1', 'a2'])
    const results = await engine.executePlan(plan.id)
    expect(results.some(r => (r as any).debate)).toBe(true)
  })
})
