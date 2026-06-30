import { describe, it, expect } from 'vitest'
import { SafetyGovernance } from './safety-governance'
import { AgentProfile, AgentTaskDef } from './agentos-types'

function makeAgent(overrides: Partial<AgentProfile> = {}): AgentProfile {
  return {
    id: 'agent-1', name: 'Test Agent', role: 'executor',
    description: '', systemPrompt: '', skills: [], capabilities: ['analysis'],
    model: { provider: 'openai', model: 'gpt-4o' },
    maxConcurrency: 1, safetyLevel: 'moderate', ownerId: 'user-1',
    status: 'idle', version: 1, createdAt: Date.now(), updatedAt: Date.now(),
    metadata: {},
    ...overrides,
  }
}

function makeTask(overrides: Partial<AgentTaskDef> = {}): AgentTaskDef {
  return {
    id: 'task-1', description: 'Analyze data', priority: 50,
    dependencies: [], estimatedComplexity: 2,
    requiredCapabilities: ['analysis'], status: 'pending',
    retryCount: 0, maxRetries: 3, createdAt: Date.now(),
    ...overrides,
  }
}

describe('SafetyGovernance', () => {
  it('has default policies registered', () => {
    const safety = new SafetyGovernance()
    const agent = makeAgent()
    // Should not throw when checking a normal task
    expect(async () => {
      await safety.checkTaskAllowed(makeTask(), agent)
    }).not.toThrow()
  })

  it('addPolicy and removePolicy', () => {
    const safety = new SafetyGovernance()
    safety.addPolicy({
      id: 'custom-policy', name: 'Custom', description: '',
      rules: [], scope: 'agent', priority: 50, enabled: true,
    })
    safety.removePolicy('custom-policy')
  })

  it('checkTaskAllowed allows normal tasks', async () => {
    const safety = new SafetyGovernance()
    const result = await safety.checkTaskAllowed(makeTask(), makeAgent())
    expect(result.allowed).toBe(true)
    expect(Array.isArray(result.violations)).toBe(true)
  })

  it('checkBudgetAllowed returns true for unlimited budget', async () => {
    const safety = new SafetyGovernance()
    expect(await safety.checkBudgetAllowed('agent-1', 100)).toBe(true)
  })

  it('checkBudgetAllowed denies when budget exceeded', async () => {
    const safety = new SafetyGovernance()
    safety.setAgentBudget('agent-1', 50)
    expect(await safety.checkBudgetAllowed('agent-1', 100)).toBe(false)
  })

  it('deductBudget reduces remaining budget', async () => {
    const safety = new SafetyGovernance()
    safety.setAgentBudget('agent-1', 100)
    safety.deductBudget('agent-1', 30)
    expect(await safety.checkBudgetAllowed('agent-1', 80)).toBe(false)
    expect(await safety.checkBudgetAllowed('agent-1', 70)).toBe(true)
  })

  it('getAuditLog returns recent entries', async () => {
    const safety = new SafetyGovernance()
    const agent = makeAgent()
    safety.setAgentBudget('agent-1', 10)
    await safety.checkBudgetAllowed('agent-1', 100)
    const log = safety.getAuditLog()
    expect(log.length).toBeGreaterThan(0)
    expect(log[0].agentId).toBe('agent-1')
  })
})
