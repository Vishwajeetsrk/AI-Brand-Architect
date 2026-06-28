import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PlannerEngine, AgentGoal, AgentTaskDef, TaskStatus } from '@nexora/ai-engine';
import { prisma } from '@nexora/database';

@Injectable()
export class PlannerService {
  private readonly logger = new Logger(PlannerService.name);
  private engine: PlannerEngine;

  constructor() {
    this.engine = new PlannerEngine({ maxTasksPerPlan: 20, defaultMaxRetries: 3, strategy: 'hybrid' });
  }

  async createGoal(dto: {
    description: string;
    priority?: number;
    deadline?: number;
    constraints?: string[];
    successCriteria?: string[];
    parentGoalId?: string;
    context?: Record<string, unknown>;
  }, userId: string): Promise<any> {
    const goal = await this.engine.createGoal(dto.description, {
      priority: dto.priority,
      deadline: dto.deadline,
      constraints: dto.constraints,
      successCriteria: dto.successCriteria,
      parentGoalId: dto.parentGoalId,
      context: dto.context,
    });

    const record = await prisma.agentGoal.create({
      data: {
        id: goal.id,
        description: goal.description,
        priority: goal.priority,
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
        constraints: goal.constraints || [],
        successCriteria: goal.successCriteria || [],
        context: (goal.context || undefined) as any,
        status: 'PENDING',
        parentGoalId: goal.parentGoalId || undefined,
        userId,
      },
    });

    this.logger.debug(`Created goal ${goal.id}: ${goal.description.slice(0, 60)}`);
    return record;
  }

  async listGoals(userId?: string): Promise<any> {
    const where = userId ? { userId } : {};
    return prisma.agentGoal.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async getGoal(id: string): Promise<any> {
    const goal = await prisma.agentGoal.findUnique({
      where: { id },
      include: { tasks: true, subGoals: true },
    });
    if (!goal) throw new NotFoundException(`Goal ${id} not found`);
    return goal;
  }

  async deleteGoal(id: string): Promise<void> {
    const goal = await prisma.agentGoal.findUnique({ where: { id } });
    if (!goal) throw new NotFoundException(`Goal ${id} not found`);
    await prisma.agentGoal.delete({ where: { id } });
  }

  async createPlan(goalId: string, capabilities: string[], userId: string): Promise<any> {
    const goal = await prisma.agentGoal.findUnique({ where: { id: goalId } });
    if (!goal) throw new NotFoundException(`Goal ${goalId} not found`);

    const agentGoal: AgentGoal = {
      id: goal.id,
      description: goal.description,
      priority: goal.priority,
      deadline: goal.deadline?.getTime(),
      constraints: goal.constraints as string[],
      successCriteria: goal.successCriteria as string[],
      subGoalIds: [],
      status: 'pending',
      createdAt: goal.createdAt.getTime(),
    };

    const plan = await this.engine.plan(goalId, capabilities);

    for (const task of plan.tasks) {
      await prisma.agentTask.create({
        data: {
          id: task.id,
          description: task.description,
          goalId,
          assignedAgentRole: (task.assignedAgentRole?.toUpperCase() || undefined) as any,
          priority: task.priority,
          dependencies: task.dependencies,
          estimatedComplexity: task.estimatedComplexity,
          requiredCapabilities: task.requiredCapabilities,
          status: task.status.toUpperCase() as any,
          retryCount: task.retryCount,
          maxRetries: task.maxRetries,
          userId,
        },
      });
    }

    await prisma.agentGoal.update({
      where: { id: goalId },
      data: { status: 'RUNNING' },
    });

    this.logger.debug(`Created plan ${plan.id} for goal ${goalId} with ${plan.tasks.length} tasks`);

    return {
      id: plan.id,
      goalId: plan.goalId,
      goal: plan.goal,
      strategy: plan.strategy,
      status: plan.status,
      tasks: plan.tasks,
      createdAt: plan.createdAt,
    };
  }

  async listPlans(): Promise<any[]> {
    return this.engine.getAllPlans().map(p => ({
      id: p.id,
      goalId: p.goalId,
      goal: p.goal,
      strategy: p.strategy,
      status: p.status,
      taskCount: p.tasks.length,
      completedCount: p.tasks.filter(t => t.status === 'completed').length,
      createdAt: p.createdAt,
    }));
  }

  async getPlan(planId: string): Promise<any> {
    const plan = this.engine.getPlan(planId);
    if (!plan) throw new NotFoundException(`Plan ${planId} not found`);
    return plan;
  }

  async getExecutionTree(planId: string): Promise<any> {
    const tree = this.engine.getExecutionTree(planId);
    if (!tree) throw new NotFoundException(`Plan ${planId} not found`);
    return tree;
  }

  async updateTaskStatus(taskId: string, dto: { status: string; result?: string; error?: string }): Promise<void> {
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task ${taskId} not found`);

    const statusMap: Record<string, TaskStatus> = {
      COMPLETED: 'completed',
      FAILED: 'failed',
      RUNNING: 'running',
      PENDING: 'pending',
      CANCELLED: 'cancelled',
    };

    const engineStatus = statusMap[dto.status.toUpperCase()] || 'pending';

    const updateData: any = {
      status: dto.status.toUpperCase(),
      ...(dto.result ? { result: dto.result } : {}),
      ...(dto.error ? { error: dto.error } : {}),
      ...(dto.status.toUpperCase() === 'COMPLETED' ? { completedAt: new Date() } : {}),
      ...(dto.status.toUpperCase() === 'RUNNING' ? { startedAt: new Date() } : {}),
    };

    await prisma.agentTask.update({ where: { id: taskId }, data: updateData });

    const allTasks = await prisma.agentTask.findMany({ where: { goalId: task.goalId } });
    const planId = task.goalId;

    this.engine.updateTaskStatus(planId, taskId, {
      status: engineStatus,
      result: dto.result,
      error: dto.error,
    } as any);

    if (dto.status.toUpperCase() === 'COMPLETED' || dto.status.toUpperCase() === 'FAILED') {
      const allTasksDone = allTasks.every(t => ['COMPLETED', 'FAILED', 'CANCELLED'].includes(t.status));
      if (allTasksDone) {
        const goalStatus = allTasks.every(t => t.status === 'COMPLETED') ? 'COMPLETED' : 'FAILED';
        await prisma.agentGoal.update({
          where: { id: task.goalId },
          data: { status: goalStatus, completedAt: new Date() },
        });
      }
    }

    this.logger.debug(`Updated task ${taskId} status to ${dto.status}`);
  }

  async replan(planId: string, dto: { failedTaskId: string; error: string; capabilities: string[] }): Promise<any> {
    const plan = await this.engine.replan(planId, dto.failedTaskId, dto.error, dto.capabilities);
    if (!plan) throw new NotFoundException(`Plan ${planId} not found`);

    await prisma.agentGoal.update({
      where: { id: plan.goalId },
      data: { status: 'RUNNING' },
    });

    return plan;
  }

  async getPendingTasks(goalId: string): Promise<any[]> {
    return prisma.agentTask.findMany({
      where: { goalId, status: 'PENDING' },
      orderBy: { priority: 'desc' },
    });
  }
}
