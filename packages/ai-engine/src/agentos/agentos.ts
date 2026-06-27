import { AgentRegistry } from './agent-registry';
import { PlannerEngine } from './planner-engine';
import { ReflectionEngine } from './reflection-engine';
import { CommunicationBus } from './communication-bus';
import { CoordinationEngine } from './coordination-engine';
import { TaskScheduler } from './task-scheduler';
import { SafetyGovernance } from './safety-governance';
import {
  AgentProfile, AgentRole, AgentStatus, AgentGoal, AgentTaskPlan,
  AgentTaskDef, CoordinationStrategy, SafetyLevel, ReflectionResult,
} from './agentos-types';

export class AgentOS {
  public registry: AgentRegistry;
  public planner: PlannerEngine;
  public reflection: ReflectionEngine;
  public bus: CommunicationBus;
  public coordination: CoordinationEngine;
  public scheduler: TaskScheduler;
  public safety: SafetyGovernance;

  constructor() {
    this.registry = new AgentRegistry();
    this.planner = new PlannerEngine();
    this.reflection = new ReflectionEngine();
    this.bus = new CommunicationBus();
    this.coordination = new CoordinationEngine(this.bus, this.registry);
    this.scheduler = new TaskScheduler(5);
    this.safety = new SafetyGovernance();

    this.scheduler.setTaskHandler(async (task) => {
      await this.executeTask(task);
    });
  }

  async registerAgent(profile: Omit<AgentProfile, 'status' | 'createdAt' | 'updatedAt' | 'version'>): Promise<AgentProfile> {
    const agent: AgentProfile = {
      ...profile,
      status: 'registered',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.registry.register(agent);

    this.bus.subscribe(`agent:${agent.id}`, async (message) => {
      if (message.type === 'delegation') {
        await this.handleDelegation(agent.id, message.payload as { task: string; context?: unknown });
      }
    });

    return agent;
  }

  async createGoal(description: string, options?: {
    priority?: number;
    constraints?: string[];
    successCriteria?: string[];
    context?: Record<string, unknown>;
  }): Promise<AgentGoal> {
    return this.planner.createGoal(description, options);
  }

  async planGoal(goalId: string): Promise<AgentTaskPlan> {
    const availableCapabilities = this.getAvailableCapabilities();
    return this.planner.plan(goalId, availableCapabilities);
  }

  async executePlan(planId: string, options?: {
    agentId?: string;
    strategy?: CoordinationStrategy;
  }): Promise<{ results: string[]; reflection: ReflectionResult[] }> {
    const plan = this.planner.getPlan(planId);
    if (!plan) throw new Error(`Plan not found: ${planId}`);

    this.planner.updatePlanStatus(planId, 'running');
    const results: string[] = [];
    const reflections: ReflectionResult[] = [];

    if (options?.strategy) {
      const agents = options.agentId ? [options.agentId] : this.registry.getHealthyAgentIds();
      const coordPlan = await this.coordination.createPlan(options.strategy, plan.goal, agents);
      await this.coordination.executePlan(coordPlan.id);
    }

    this.scheduler.enqueue(plan.tasks);
    this.scheduler.start();

    await this.waitForCompletion(planId);

    this.scheduler.stop();

    const updatedPlan = this.planner.getPlan(planId);
    if (updatedPlan) {
      for (const task of updatedPlan.tasks) {
        if (task.result) results.push(task.result);
        const reflection = this.reflection.getResult(task.id);
        if (reflection) reflections.push(reflection);
      }
    }

    const allCompleted = updatedPlan?.tasks.every(t => t.status === 'completed' || t.status === 'failed');
    this.planner.updatePlanStatus(planId, allCompleted ? 'completed' : 'failed');

    return { results, reflection: reflections };
  }

  async assignTask(agentId: string, description: string, context?: unknown): Promise<string> {
    const goal = await this.planner.createGoal(description, {
      context: context as Record<string, unknown>,
    });

    const availableCapabilities = this.registry.get(agentId)?.capabilities || [];
    const plan = await this.planner.plan(goal.id, availableCapabilities);

    for (const task of plan.tasks) {
      task.assignedAgentId = agentId;
    }

    this.scheduler.enqueue(plan.tasks);
    this.scheduler.start();

    await this.waitForCompletion(plan.id);
    this.scheduler.stop();

    return plan.id;
  }

  async coordinate(strategy: CoordinationStrategy, goal: string, agentIds?: string[]): Promise<string> {
    const targetAgents = agentIds || this.registry.getHealthyAgentIds();
    if (targetAgents.length === 0) throw new Error('No available agents to coordinate');

    const plan = await this.coordination.createPlan(strategy, goal, targetAgents);
    await this.coordination.executePlan(plan.id);

    return plan.id;
  }

  async reflectOnTask(taskId: string): Promise<ReflectionResult | undefined> {
    return this.reflection.getResult(taskId);
  }

  private async executeTask(task: AgentTaskDef): Promise<void> {
    const agent = task.assignedAgentId ? this.registry.get(task.assignedAgentId) : undefined;

    if (agent) {
      const safetyCheck = await this.safety.checkTaskAllowed(task, agent);
      if (!safetyCheck.allowed) {
        this.scheduler.failTask(task.id, `Blocked by safety policy: ${safetyCheck.violations.map(v => v.message).join(', ')}`);
        return;
      }
    }

    const response = agent
      ? await this.bus.request(agent.id, `execute:${task.id}`, {
          task: task.description,
          requiredCapabilities: task.requiredCapabilities,
          dependencies: task.dependencies,
        })
      : { payload: `No agent assigned to task: ${task.description}` };

    const output = typeof response.payload === 'string' ? response.payload : JSON.stringify(response.payload);
    const reflection = await this.reflection.evaluate(task, output);

    if (reflection.needsRetry) {
      const alternative = await this.reflection.suggestAlternative(task, output);
      this.scheduler.failTask(task.id, `Reflection failed (score: ${reflection.confidence}). ${alternative}`);
    } else {
      this.scheduler.completeTask(task.id, output);
    }
  }

  private async handleDelegation(agentId: string, payload: { task: string; context?: unknown }): Promise<void> {
    const planId = await this.assignTask(agentId, payload.task, payload.context);
    const plan = this.planner.getPlan(planId);
    const result = plan?.tasks.map(t => t.result).filter(Boolean).join('\n') || '';

    this.bus.publish({
      id: crypto.randomUUID(),
      fromAgentId: agentId,
      topic: `delegation:result:${agentId}`,
      type: 'response',
      payload: { result, planId },
      priority: 50,
      timestamp: Date.now(),
    });
  }

  private getAvailableCapabilities(): string[] {
    const capabilities = new Set<string>();
    for (const agent of this.registry.getAll()) {
      for (const cap of agent.capabilities) {
        capabilities.add(cap);
      }
    }
    return Array.from(capabilities);
  }

  private async waitForCompletion(planId: string, timeoutMs: number = 120000): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (this.planner.areAllTasksComplete(planId)) return;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    throw new Error(`Plan ${planId} timed out after ${timeoutMs}ms`);
  }

  getStats(): {
    agents: { total: number; byRole: Record<string, number>; byStatus: Record<string, number> };
    scheduler: { queued: number; executing: number; completed: number; failed: number };
  } {
    return {
      agents: this.registry.getStats(),
      scheduler: this.scheduler.getStats(),
    };
  }
}
