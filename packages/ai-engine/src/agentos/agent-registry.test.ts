import { describe, it, expect } from 'vitest'
import { AgentRegistry } from './agent-registry'
import { AgentProfile } from './agentos-types'

function makeProfile(overrides: Partial<AgentProfile> = {}): AgentProfile {
  return {
    id: 'agent-1',
    name: 'Test Agent',
    role: 'executor',
    description: 'A test agent',
    systemPrompt: 'You are a test agent',
    skills: ['test'],
    capabilities: ['analysis'],
    model: { provider: 'openai', model: 'gpt-4o' },
    maxConcurrency: 1,
    safetyLevel: 'moderate',
    ownerId: 'user-1',
    status: 'registered',
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    metadata: {},
    ...overrides,
  }
}

describe('AgentRegistry', () => {
  it('register and get an agent', () => {
    const registry = new AgentRegistry()
    const profile = makeProfile()
    registry.register(profile)
    expect(registry.get('agent-1')).toBeDefined()
    expect(registry.get('agent-1')!.name).toBe('Test Agent')
  })

  it('register sets status to registered', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile({ status: 'idle' }))
    expect(registry.get('agent-1')!.status).toBe('registered')
  })

  it('get returns undefined for unknown id', () => {
    const registry = new AgentRegistry()
    expect(registry.get('nonexistent')).toBeUndefined()
  })

  it('getAll returns all registered agents', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile({ id: 'a1' }))
    registry.register(makeProfile({ id: 'a2' }))
    expect(registry.getAll()).toHaveLength(2)
  })

  it('findByRole filters by role', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile({ id: 'a1', role: 'planner' }))
    registry.register(makeProfile({ id: 'a2', role: 'executor' }))
    registry.register(makeProfile({ id: 'a3', role: 'executor' }))
    expect(registry.findByRole('executor')).toHaveLength(2)
    expect(registry.findByRole('planner')).toHaveLength(1)
  })

  it('findByCapability filters by capability', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile({ id: 'a1', capabilities: ['research', 'analysis'] }))
    registry.register(makeProfile({ id: 'a2', capabilities: ['creative'] }))
    expect(registry.findByCapability('analysis')).toHaveLength(1)
    expect(registry.findByCapability('creative')).toHaveLength(1)
  })

  it('findByStatus filters by status', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile({ id: 'a1', status: 'registered' }))
    registry.register(makeProfile({ id: 'a2', status: 'registered' }))
    registry.updateStatus('a1', 'idle')
    expect(registry.findByStatus('idle')).toHaveLength(1)
    expect(registry.findByStatus('registered')).toHaveLength(1)
  })

  it('updateStatus changes agent status', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile())
    registry.updateStatus('agent-1', 'executing')
    expect(registry.get('agent-1')!.status).toBe('executing')
  })

  it('recordHeartbeat updates lastHeartbeat', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile())
    registry.recordHeartbeat('agent-1')
    expect(registry.get('agent-1')!.lastHeartbeat).toBeGreaterThan(0)
  })

  it('remove deletes an agent', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile())
    expect(registry.remove('agent-1')).toBe(true)
    expect(registry.get('agent-1')).toBeUndefined()
  })

  it('remove returns false for unknown agent', () => {
    const registry = new AgentRegistry()
    expect(registry.remove('nonexistent')).toBe(false)
  })

  it('getHealthyAgentIds returns idle and executing agents within heartbeat timeout', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile({ id: 'a1', lastHeartbeat: Date.now() }))
    registry.register(makeProfile({ id: 'a2', lastHeartbeat: Date.now() }))
    registry.register(makeProfile({ id: 'a3' }))
    registry.updateStatus('a1', 'idle')
    registry.updateStatus('a2', 'executing')
    const healthy = registry.getHealthyAgentIds()
    expect(healthy).toContain('a1')
    expect(healthy).toContain('a2')
    expect(healthy).not.toContain('a3')
  })

  it('getStats returns correct counts', () => {
    const registry = new AgentRegistry()
    registry.register(makeProfile({ id: 'a1', role: 'executor' }))
    registry.register(makeProfile({ id: 'a2', role: 'executor' }))
    registry.register(makeProfile({ id: 'a3', role: 'planner' }))
    registry.updateStatus('a1', 'idle')
    registry.updateStatus('a2', 'executing')
    registry.updateStatus('a3', 'idle')
    const stats = registry.getStats()
    expect(stats.total).toBe(3)
    expect(stats.byRole['executor']).toBe(2)
    expect(stats.byRole['planner']).toBe(1)
    expect(stats.byStatus['idle']).toBe(2)
    expect(stats.byStatus['executing']).toBe(1)
  })
})
