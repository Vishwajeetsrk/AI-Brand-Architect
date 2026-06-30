import { describe, it, expect } from 'vitest'
import { ReflectionEngine } from './reflection-engine'
import { AgentTaskDef } from './agentos-types'

function makeTask(overrides: Partial<AgentTaskDef> = {}): AgentTaskDef {
  return {
    id: 'task-1', description: 'Analyze market data and provide insights',
    priority: 50, dependencies: [], estimatedComplexity: 2,
    requiredCapabilities: ['analysis'], status: 'pending',
    retryCount: 0, maxRetries: 3, createdAt: Date.now(),
    ...overrides,
  }
}

describe('ReflectionEngine', () => {
  it('evaluate returns a result with score', async () => {
    const engine = new ReflectionEngine()
    const result = await engine.evaluate(makeTask(), 'This analysis provides a comprehensive overview of the market trends for Q3 2026. The key findings indicate a significant 15% growth in demand across all major segments. In summary, the data supports continued investment in this sector with a focus on emerging technologies.')
    expect(result.taskId).toBe('task-1')
    expect(result.evaluation.score).toBeGreaterThan(0)
    expect(result.evaluation.dimensions).toHaveLength(5)
  })

  it('evaluate flags empty output', async () => {
    const engine = new ReflectionEngine()
    const result = await engine.evaluate(makeTask(), '')
    expect(result.evaluation.issues).toContain('Empty output produced')
    expect(result.needsRetry).toBe(true)
  })

  it('evaluate flags brief output', async () => {
    const engine = new ReflectionEngine()
    const result = await engine.evaluate(makeTask(), 'Done')
    expect(result.evaluation.issues.length).toBeGreaterThan(0)
  })

  it('evaluate flags error references', async () => {
    const engine = new ReflectionEngine()
    const result = await engine.evaluate(makeTask(), 'An error occurred while processing the request')
    expect(result.evaluation.issues.length).toBeGreaterThan(0)
    expect(result.evaluation.passed).toBe(false)
  })

  it('getResult returns stored result', async () => {
    const engine = new ReflectionEngine()
    await engine.evaluate(makeTask(), 'Good output with sufficient detail for analysis purposes.')
    const result = engine.getResult('task-1')
    expect(result).toBeDefined()
  })

  it('getResult returns undefined for unknown task', () => {
    const engine = new ReflectionEngine()
    expect(engine.getResult('unknown')).toBeUndefined()
  })

  it('getAllResults returns all evaluations', async () => {
    const engine = new ReflectionEngine()
    await engine.evaluate(makeTask({ id: 't1' }), 'First result with enough content.')
    await engine.evaluate(makeTask({ id: 't2' }), 'Second result with enough content.')
    expect(engine.getAllResults()).toHaveLength(2)
  })

  it('batchEvaluate evaluates multiple tasks', async () => {
    const engine = new ReflectionEngine()
    const results = await engine.batchEvaluate([
      { task: makeTask({ id: 'b1' }), output: 'Batch one output.' },
      { task: makeTask({ id: 'b2' }), output: 'Batch two output.' },
    ])
    expect(results).toHaveLength(2)
  })

  it('suggestAlternative returns suggestions', async () => {
    const engine = new ReflectionEngine()
    const suggestion = await engine.suggestAlternative(makeTask({ retryCount: 1 }), 'API call failed')
    expect(suggestion.length).toBeGreaterThan(0)
  })

  it('recordFeedback tracks calibration data', () => {
    const engine = new ReflectionEngine()
    engine.recordFeedback({
      taskId: 'f1', predictedScore: 0.8, actualScore: 0.7,
      corrected: false, timestamp: Date.now(),
    })
    const cal = engine.getConfidenceCalibration()
    expect(cal.sampleSize).toBe(1)
    expect(cal.averageError).toBeCloseTo(0.1, 5)
  })

  it('getConfidenceCalibration returns zeros with no data', () => {
    const engine = new ReflectionEngine()
    const cal = engine.getConfidenceCalibration()
    expect(cal.averageError).toBe(0)
    expect(cal.sampleSize).toBe(0)
  })

  it('toPrismaData serializes correctly', async () => {
    const engine = new ReflectionEngine()
    await engine.evaluate(makeTask(), 'Good enough output for testing prisma serialization.')
    const result = engine.getResult('task-1')!
    const data = engine.toPrismaData(result)
    expect(data.taskId).toBe('task-1')
    expect(data.score).toBeGreaterThan(0)
    expect(Array.isArray(data.issues)).toBe(true)
  })
})
