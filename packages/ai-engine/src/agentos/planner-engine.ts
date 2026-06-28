import { AgentGoal, AgentTaskPlan, AgentTaskDef } from './agentos-types';

interface PlannerOptions {
  maxTasksPerPlan: number;
  defaultMaxRetries: number;
  strategy: 'sequential' | 'parallel' | 'hybrid';
}

export class PlannerEngine {
  private goals: Map<string, AgentGoal> = new Map();
  private plans: Map<string, AgentTaskPlan> = new Map();
  private options: PlannerOptions;

  constructor(options?: Partial<PlannerOptions>) {
    this.options = {
      maxTasksPerPlan: options?.maxTasksPerPlan || 20,
      defaultMaxRetries: options?.defaultMaxRetries || 3,
      strategy: options?.strategy || 'hybrid',
    };
  }

  async createGoal(description: string, options?: {
    priority?: number;
    deadline?: number;
    constraints?: string[];
    successCriteria?: string[];
    parentGoalId?: string;
    context?: Record<string, unknown>;
  }): Promise<AgentGoal> {
    const goal: AgentGoal = {
      id: crypto.randomUUID(),
      description,
      priority: options?.priority ?? 50,
      deadline: options?.deadline,
      constraints: options?.constraints,
      successCriteria: options?.successCriteria || ['Task completed successfully'],
      parentGoalId: options?.parentGoalId,
      subGoalIds: [],
      context: options?.context,
      status: 'pending',
      createdAt: Date.now(),
    };
    this.goals.set(goal.id, goal);
    return goal;
  }

  async plan(goalId: string, availableCapabilities: string[]): Promise<AgentTaskPlan> {
    const goal = this.goals.get(goalId);
    if (!goal) throw new Error(`Goal not found: ${goalId}`);

    const planId = crypto.randomUUID();
    const tasks = await this.decomposeGoal(goal, availableCapabilities);
    const strategy = this.determineStrategy(tasks);

    const plan: AgentTaskPlan = {
      id: planId,
      goalId: goal.id,
      goal: goal.description,
      tasks,
      strategy,
      status: 'pending',
      createdAt: Date.now(),
    };

    this.plans.set(planId, plan);
    goal.status = 'running';
    return plan;
  }

  async replan(planId: string, failedTaskId: string, error: string, availableCapabilities: string[]): Promise<AgentTaskPlan> {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan not found: ${planId}`);

    const failedIdx = plan.tasks.findIndex(t => t.id === failedTaskId);
    if (failedIdx === -1) throw new Error(`Task not found: ${failedTaskId}`);

    const completed = plan.tasks.slice(0, failedIdx).filter(t => t.status === 'completed');
    const remaining = plan.tasks.slice(failedIdx).map(t => ({
      ...t,
      status: 'pending' as const,
      retryCount: t.id === failedTaskId ? t.retryCount + 1 : t.retryCount,
      error: t.id === failedTaskId ? error : undefined,
    }));

    const goal = this.goals.get(plan.goalId);
    let newTasks: AgentTaskDef[] = [];
    if (goal && remaining.length > 0 && remaining[0].retryCount <= remaining[0].maxRetries) {
      const goalDesc = goal.description;
      newTasks = this.generateAlternativeTasks(remaining[0], goalDesc, availableCapabilities);
    }

    const finalTasks = [...completed, ...(newTasks.length > 0 ? newTasks : remaining)];
    plan.tasks = finalTasks;
    plan.status = 'running';
    plan.metadata = {
      ...(plan.metadata || {}),
      replanAt: Date.now(),
      replannedFrom: failedTaskId,
      replanReason: error,
    };

    this.plans.set(planId, plan);
    return plan;
  }

  getPlan(planId: string): AgentTaskPlan | undefined {
    return this.plans.get(planId);
  }

  getGoal(goalId: string): AgentGoal | undefined {
    return this.goals.get(goalId);
  }

  getAllGoals(): AgentGoal[] {
    return Array.from(this.goals.values());
  }

  getAllPlans(): AgentTaskPlan[] {
    return Array.from(this.plans.values());
  }

  updatePlanStatus(planId: string, status: AgentTaskDef['status']): void {
    const plan = this.plans.get(planId);
    if (plan) plan.status = status;
  }

  updateTaskStatus(planId: string, taskId: string, update: Partial<AgentTaskDef>): void {
    const plan = this.plans.get(planId);
    if (!plan) return;
    const task = plan.tasks.find(t => t.id === taskId);
    if (task) Object.assign(task, update);
  }

  getNextReadyTasks(planId: string): AgentTaskDef[] {
    const plan = this.plans.get(planId);
    if (!plan || (plan.status !== 'pending' && plan.status !== 'running')) return [];

    const completed = new Set(plan.tasks.filter(t => t.status === 'completed').map(t => t.id));

    return plan.tasks.filter(task => {
      if (task.status !== 'pending' && task.status !== 'scheduled') return false;
      return task.dependencies.every(dep => completed.has(dep));
    });
  }

  areAllTasksComplete(planId: string): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;
    return plan.tasks.every(t => t.status === 'completed' || t.status === 'failed' || t.status === 'cancelled');
  }

  getExecutionTree(planId: string): any {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const buildTree = (taskId: string, visited: Set<string> = new Set()): any => {
      if (visited.has(taskId)) return { id: taskId, circular: true };
      visited.add(taskId);

      const task = plan!.tasks.find(t => t.id === taskId);
      if (!task) return { id: taskId, notFound: true };

      return {
        id: task.id,
        description: task.description,
        status: task.status,
        priority: task.priority,
        estimatedComplexity: task.estimatedComplexity,
        dependencies: task.dependencies.map(dep => buildTree(dep, new Set(visited))),
      };
    };

    const roots = plan.tasks.filter(t => t.dependencies.length === 0);
    return {
      planId: plan.id,
      goal: plan.goal,
      strategy: plan.strategy,
      status: plan.status,
      rootTasks: roots.map(r => buildTree(r.id)),
      stats: {
        total: plan.tasks.length,
        completed: plan.tasks.filter(t => t.status === 'completed').length,
        failed: plan.tasks.filter(t => t.status === 'failed').length,
        running: plan.tasks.filter(t => t.status === 'running').length,
        pending: plan.tasks.filter(t => t.status === 'pending').length,
      },
    };
  }

  toPrismaGoalData(goal: AgentGoal): Record<string, any> {
    return {
      description: goal.description,
      priority: goal.priority,
      deadline: goal.deadline ? new Date(goal.deadline) : undefined,
      constraints: goal.constraints || [],
      successCriteria: goal.successCriteria || [],
      context: goal.context || undefined,
      status: goal.status.toUpperCase(),
      parentGoalId: goal.parentGoalId || undefined,
    };
  }

  toPrismaTaskData(task: AgentTaskDef, goalId: string, userId: string): Record<string, any> {
    return {
      description: task.description,
      goalId,
      assignedAgentId: task.assignedAgentId || undefined,
      assignedAgentRole: task.assignedAgentRole?.toUpperCase() || undefined,
      priority: task.priority,
      dependencies: task.dependencies,
      estimatedComplexity: task.estimatedComplexity,
      requiredCapabilities: task.requiredCapabilities,
      status: task.status.toUpperCase(),
      result: task.result || undefined,
      error: task.error || undefined,
      retryCount: task.retryCount,
      maxRetries: task.maxRetries,
      metadata: task.metadata || undefined,
      userId,
    };
  }

  private generateAlternativeTasks(failedTask: AgentTaskDef, goalDescription: string, capabilities: string[]): AgentTaskDef[] {
    const tasks: AgentTaskDef[] = [];
    const isCreative = capabilities.some(c => c.includes('creative') || c.includes('generate'));
    const isAnalytical = capabilities.some(c => c.includes('analysis') || c.includes('research'));

    if (isAnalytical) {
      tasks.push(this.makeTask(0, `Re-analyze: ${failedTask.description} (alternative approach)`, ['research', 'analysis'], 70));
    }
    if (isCreative) {
      tasks.push(this.makeTask(1, `Generate revised output for: ${goalDescription}`, ['creative', 'content_generation'], 60, tasks.length > 0 ? [tasks[tasks.length - 1].id] : []));
    }
    if (tasks.length === 0) {
      tasks.push(this.makeTask(0, `Retry: ${failedTask.description}`, capabilities.slice(0, 3), 50));
    }

    return tasks;
  }

  private async decomposeGoal(goal: AgentGoal, availableCapabilities: string[]): Promise<AgentTaskDef[]> {
    const tasks: AgentTaskDef[] = [];
    const constraints = goal.constraints || [];

    const primaryTasks = this.generatePrimaryTasks(goal, availableCapabilities);
    tasks.push(...primaryTasks);

    for (const constraint of constraints) {
      const verificationTask = this.createVerificationTask(constraint, tasks.length);
      verificationTask.dependencies = tasks.map(t => t.id);
      tasks.push(verificationTask);
    }

    if (goal.successCriteria.length > 0) {
      const validationTask: AgentTaskDef = {
        id: `validation-${goal.id}`,
        description: `Validate success criteria: ${goal.successCriteria.join(', ')}`,
        assignedAgentRole: 'supervisor',
        priority: 0,
        dependencies: tasks.filter(t => t.status !== 'cancelled').map(t => t.id),
        estimatedComplexity: 1,
        requiredCapabilities: ['evaluation', 'analysis'],
        status: 'pending',
        retryCount: 0,
        maxRetries: 1,
        createdAt: Date.now(),
      };
      tasks.push(validationTask);
    }

    return tasks.slice(0, this.options.maxTasksPerPlan);
  }

  private generatePrimaryTasks(goal: AgentGoal, capabilities: string[]): AgentTaskDef[] {
    const tasks: AgentTaskDef[] = [];
    const desc = goal.description.toLowerCase();

    if (desc.includes('research') || desc.includes('analyze') || desc.includes('investigate')) {
      tasks.push(this.makeTask(tasks.length, 'Research and gather information', ['research', 'search'], 80));
      tasks.push(this.makeTask(tasks.length, 'Analyze gathered data', ['analysis'], 70, [tasks[tasks.length - 1].id]));
    }

    if (desc.includes('create') || desc.includes('generate') || desc.includes('write') || desc.includes('design')) {
      tasks.push(this.makeTask(tasks.length, 'Plan creation approach', ['planning'], 60));
      tasks.push(this.makeTask(tasks.length, 'Generate initial draft', ['content_generation', 'creative'], 50, [tasks[tasks.length - 1].id]));
      tasks.push(this.makeTask(tasks.length, 'Review and refine output', ['evaluation', 'editing'], 40, [tasks[tasks.length - 1].id]));
    }

    if (desc.includes('build') || desc.includes('develop') || desc.includes('implement')) {
      tasks.push(this.makeTask(tasks.length, 'Design architecture and plan implementation', ['planning', 'architecture'], 75));
      tasks.push(this.makeTask(tasks.length, 'Build core components', ['development', 'implementation'], 65, [tasks[tasks.length - 1].id]));
      tasks.push(this.makeTask(tasks.length, 'Test and validate implementation', ['testing', 'evaluation'], 55, [tasks[tasks.length - 1].id]));
      tasks.push(this.makeTask(tasks.length, 'Deploy and document', ['devops', 'documentation'], 45, [tasks[tasks.length - 1].id]));
    }

    if (desc.includes('optimize') || desc.includes('improve') || desc.includes('refactor')) {
      tasks.push(this.makeTask(tasks.length, 'Audit current state and identify bottlenecks', ['analysis', 'audit'], 80));
      tasks.push(this.makeTask(tasks.length, 'Develop optimization plan', ['planning'], 70, [tasks[tasks.length - 1].id]));
      tasks.push(this.makeTask(tasks.length, 'Implement optimizations', ['development', 'implementation'], 60, [tasks[tasks.length - 1].id]));
      tasks.push(this.makeTask(tasks.length, 'Measure and verify improvements', ['analysis', 'testing'], 50, [tasks[tasks.length - 1].id]));
    }

    if (tasks.length === 0) {
      tasks.push(this.makeTask(tasks.length, 'Execute goal: ' + goal.description, capabilities.slice(0, 3), 50));
    }

    return tasks;
  }

  private makeTask(index: number, description: string, capabilities: string[], priority: number, dependencies: string[] = []): AgentTaskDef {
    return {
      id: `task-${crypto.randomUUID().slice(0, 8)}`,
      description,
      priority,
      dependencies,
      estimatedComplexity: capabilities.length > 2 ? 3 : 1,
      requiredCapabilities: capabilities,
      status: 'pending',
      retryCount: 0,
      maxRetries: this.options.defaultMaxRetries,
      createdAt: Date.now(),
    };
  }

  private createVerificationTask(constraint: string, index: number): AgentTaskDef {
    return {
      id: `verify-constraint-${index}`,
      description: `Verify constraint: ${constraint}`,
      assignedAgentRole: 'supervisor',
      priority: 0,
      dependencies: [],
      estimatedComplexity: 1,
      requiredCapabilities: ['evaluation'],
      status: 'pending',
      retryCount: 0,
      maxRetries: 2,
      createdAt: Date.now(),
    };
  }

  private determineStrategy(tasks: AgentTaskDef[]): 'sequential' | 'parallel' | 'hybrid' {
    const hasDependencies = tasks.some(t => t.dependencies.length > 0);
    const allIndependent = tasks.every(t => t.dependencies.length === 0);

    if (tasks.length <= 1) return 'sequential';
    if (allIndependent && tasks.length > 3) return 'parallel';
    return 'hybrid';
  }
}
