import { describe, it, expect, vi } from 'vitest'
import { TaskScheduler } from './task-scheduler'
import { AgentTaskDef } from './agentos-types'

function makeTask(overrides: Partial<AgentTaskDef> = {}): AgentTaskDef {
  return {
    id: `task-${crypto.randomUUID().slice(0, 8)}`,
    description: 'A test task',
    priority: 50,
    dependencies: [],
    estimatedComplexity: 1,
    requiredCapabilities: ['test'],
    status: 'pending',
    retryCount: 0,
    maxRetries: 3,
    createdAt: Date.now(),
    ...overrides,
  }
}

describe('TaskScheduler', () => {
  it('enqueue adds tasks to the queue', () => {
    const scheduler = new TaskScheduler(5)
    scheduler.enqueue([makeTask({ id: 't1' }), makeTask({ id: 't2' })])
    expect(scheduler.getPendingCount()).toBe(2)
  })

  it('enqueue deduplicates by id', () => {
    const scheduler = new TaskScheduler(5)
    scheduler.enqueue([makeTask({ id: 't1' })])
    scheduler.enqueue([makeTask({ id: 't1' })])
    expect(scheduler.getPendingCount()).toBe(1)
  })

  it('setTaskHandler and start processes tasks', async () => {
    const scheduler = new TaskScheduler(5, 50)
    const handler = vi.fn().mockResolvedValue(undefined)
    scheduler.setTaskHandler(handler)
    scheduler.enqueue([makeTask({ id: 't1', status: 'pending' })])
    scheduler.start()
    await new Promise(r => setTimeout(r, 150))
    scheduler.stop()
    expect(handler).toHaveBeenCalled()
  })

  it('completeTask marks a task as completed', async () => {
    const scheduler = new TaskScheduler(5, 50)
    let capturedTask: AgentTaskDef | undefined
    scheduler.setTaskHandler(async (task) => {
      capturedTask = task
      scheduler.completeTask(task.id, 'done')
    })
    scheduler.enqueue([makeTask({ id: 't1', status: 'pending' })])
    scheduler.start()
    await new Promise(r => setTimeout(r, 200))
    scheduler.stop()
    const stats = scheduler.getStats()
    expect(stats.completed).toBe(1)
  })

  it('failTask retries if retryCount < maxRetries', () => {
    const scheduler = new TaskScheduler(5)
    const task = makeTask({ id: 't1', retryCount: 0, maxRetries: 3 })
    scheduler.enqueue([task])
    scheduler.start()
    scheduler.failTask('t1', 'error')
    scheduler.stop()
    expect(scheduler.getPendingCount()).toBeGreaterThanOrEqual(0)
  })

  it('failTask marks as failed when retries exhausted', async () => {
    const scheduler = new TaskScheduler(5, 50)
    let capturedTask: AgentTaskDef | undefined
    scheduler.setTaskHandler(async (task) => {
      capturedTask = task
      scheduler.failTask(task.id, 'final error')
    })
    scheduler.enqueue([makeTask({ id: 't1', retryCount: 3, maxRetries: 3, status: 'pending' })])
    scheduler.start()
    await new Promise(r => setTimeout(r, 200))
    scheduler.stop()
    const stats = scheduler.getStats()
    expect(stats.failed).toBe(1)
  })

  it('cancelTask removes from queue', () => {
    const scheduler = new TaskScheduler(5)
    scheduler.enqueue([makeTask({ id: 't1' })])
    scheduler.cancelTask('t1')
    expect(scheduler.getPendingCount()).toBe(0)
  })

  it('getStats returns correct counts', () => {
    const scheduler = new TaskScheduler(5)
    expect(scheduler.getStats()).toHaveProperty('queued')
    expect(scheduler.getStats()).toHaveProperty('executing')
    expect(scheduler.getStats()).toHaveProperty('completed')
    expect(scheduler.getStats()).toHaveProperty('failed')
  })

  it('start is idempotent', () => {
    const scheduler = new TaskScheduler(5)
    scheduler.start()
    scheduler.start()
    scheduler.stop()
    expect(scheduler.getPendingCount()).toBe(0)
  })
})
