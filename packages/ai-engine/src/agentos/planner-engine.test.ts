import { describe, it, expect } from 'vitest'
import { PlannerEngine } from './planner-engine'

describe('PlannerEngine', () => {
  it('createGoal returns a goal with the given description', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Research market trends')
    expect(goal.description).toBe('Research market trends')
    expect(goal.id).toBeTruthy()
    expect(goal.status).toBe('pending')
    expect(goal.priority).toBe(50)
    expect(goal.createdAt).toBeGreaterThan(0)
  })

  it('createGoal accepts optional parameters', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Build a new feature', {
      priority: 90,
      constraints: ['budget < 1000'],
      successCriteria: ['Tests pass', 'Deployed'],
      context: { project: 'alpha' },
    })
    expect(goal.priority).toBe(90)
    expect(goal.constraints).toEqual(['budget < 1000'])
    expect(goal.successCriteria).toEqual(['Tests pass', 'Deployed'])
    expect(goal.context).toEqual({ project: 'alpha' })
  })

  it('getGoal returns undefined for unknown id', () => {
    const planner = new PlannerEngine()
    expect(planner.getGoal('nonexistent')).toBeUndefined()
  })

  it('getAllGoals returns all goals', async () => {
    const planner = new PlannerEngine()
    await planner.createGoal('Goal 1')
    await planner.createGoal('Goal 2')
    expect(planner.getAllGoals()).toHaveLength(2)
  })

  it('plan generates tasks for a goal', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Create a brand identity', {
      successCriteria: ['Complete brand kit'],
    })
    const plan = await planner.plan(goal.id, ['research', 'creative', 'content_generation'])
    expect(plan.goalId).toBe(goal.id)
    expect(plan.tasks.length).toBeGreaterThan(0)
    expect(plan.status).toBe('pending')
  })

  it('plan throws for unknown goal', async () => {
    const planner = new PlannerEngine()
    await expect(planner.plan('nonexistent', [])).rejects.toThrow('Goal not found')
  })

  it('getPlan returns a plan', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Test')
    const plan = await planner.plan(goal.id, [])
    expect(planner.getPlan(plan.id)).toBeDefined()
  })

  it('getAllPlans returns all plans', async () => {
    const planner = new PlannerEngine()
    const g1 = await planner.createGoal('G1')
    const g2 = await planner.createGoal('G2')
    await planner.plan(g1.id, [])
    await planner.plan(g2.id, [])
    expect(planner.getAllPlans()).toHaveLength(2)
  })

  it('updatePlanStatus changes plan status', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Test')
    const plan = await planner.plan(goal.id, [])
    planner.updatePlanStatus(plan.id, 'running')
    expect(planner.getPlan(plan.id)!.status).toBe('running')
  })

  it('updateTaskStatus updates a specific task', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Test')
    const plan = await planner.plan(goal.id, [])
    const taskId = plan.tasks[0].id
    planner.updateTaskStatus(plan.id, taskId, { status: 'running', result: 'in progress' })
    const updated = planner.getPlan(plan.id)!.tasks.find(t => t.id === taskId)!
    expect(updated.status).toBe('running')
    expect(updated.result).toBe('in progress')
  })

  it('getNextReadyTasks returns tasks with no pending dependencies', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Research and create a report')
    const plan = await planner.plan(goal.id, ['research', 'content_generation', 'analysis'])
    const ready = planner.getNextReadyTasks(plan.id)
    expect(ready.length).toBeGreaterThan(0)
    expect(ready.every(t => t.dependencies.every(d => d === '' || plan.tasks.find(pt => pt.id === d)?.status === 'completed'))).toBe(true)
  })

  it('areAllTasksComplete returns false when tasks are pending', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Test')
    const plan = await planner.plan(goal.id, [])
    expect(planner.areAllTasksComplete(plan.id)).toBe(false)
  })

  it('replan adjusts tasks after failure', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Test replan')
    const plan = await planner.plan(goal.id, ['research', 'analysis'])
    const failedTaskId = plan.tasks[0].id
    const replanned = await planner.replan(plan.id, failedTaskId, 'Execution error', ['creative'])
    expect(replanned.tasks.length).toBeGreaterThan(0)
  })

  it('getExecutionTree returns a tree structure', async () => {
    const planner = new PlannerEngine()
    const goal = await planner.createGoal('Test tree')
    const plan = await planner.plan(goal.id, ['research'])
    const tree = planner.getExecutionTree(plan.id)
    expect(tree).toBeDefined()
    expect(tree.planId).toBe(plan.id)
    expect(tree.goal).toBe(goal.description)
  })
})
