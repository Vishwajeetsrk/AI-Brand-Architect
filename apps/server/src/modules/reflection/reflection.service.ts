import { Injectable, Logger } from '@nestjs/common';
import { ReflectionEngine, AgentTaskDef } from '@nexora/ai-engine';
import { prisma } from '@nexora/database';

@Injectable()
export class ReflectionService {
  private readonly logger = new Logger(ReflectionService.name);
  private engine: ReflectionEngine;

  constructor() {
    this.engine = new ReflectionEngine();
  }

  async evaluate(taskId: string, taskDescription: string, output: string, retryCount = 0, capabilities: string[] = []): Promise<any> {
    const task: AgentTaskDef = {
      id: taskId,
      description: taskDescription,
      requiredCapabilities: capabilities,
      retryCount,
      maxRetries: 3,
      priority: 0,
      dependencies: [],
      estimatedComplexity: 0.5,
      status: 'running',
      createdAt: Date.now(),
    };

    const result = await this.engine.evaluate(task, output);

    const record = await prisma.agentReflection.create({
      data: {
        taskId: result.taskId,
        score: result.evaluation.score,
        passed: result.evaluation.passed,
        issues: result.evaluation.issues,
        improvements: result.evaluation.improvements,
        confidence: result.confidence,
        needsRetry: result.needsRetry,
        retryCount: result.retryCount,
        suggestedChanges: result.suggestedChanges,
      },
    });

    this.logger.debug(`Reflection for task ${taskId}: score=${result.evaluation.score.toFixed(2)}, passed=${result.evaluation.passed}`);

    return {
      id: record.id,
      taskId: record.taskId,
      score: record.score,
      passed: record.passed,
      issues: record.issues,
      improvements: record.improvements,
      confidence: record.confidence,
      needsRetry: record.needsRetry,
      retryCount: record.retryCount,
      suggestedChanges: record.suggestedChanges,
      createdAt: record.createdAt,
      dimensions: result.evaluation.dimensions,
    };
  }

  async batchEvaluate(inputs: { taskId: string; taskDescription: string; output: string; retryCount?: number; capabilities?: string[] }[]): Promise<any[]> {
    const results = [];
    for (const input of inputs) {
      const result = await this.evaluate(input.taskId, input.taskDescription, input.output, input.retryCount, input.capabilities);
      results.push(result);
    }
    return results;
  }

  async getResult(id: string): Promise<any> {
    const record = await prisma.agentReflection.findUnique({ where: { id } });
    if (!record) throw new Error(`Reflection result ${id} not found`);
    return record;
  }

  async getResultsByTaskId(taskId: string): Promise<any[]> {
    return prisma.agentReflection.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async list(params: { limit?: number; offset?: number; passed?: boolean; needsRetry?: boolean }): Promise<any> {
    const where: any = {};
    if (params.passed !== undefined) where.passed = params.passed;
    if (params.needsRetry !== undefined) where.needsRetry = params.needsRetry;

    const [items, total] = await Promise.all([
      prisma.agentReflection.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: params.limit || 50,
        skip: params.offset || 0,
      }),
      prisma.agentReflection.count({ where }),
    ]);

    return { items, total };
  }

  async getStats(): Promise<any> {
    const [total, passed, failed, avgScore] = await Promise.all([
      prisma.agentReflection.count(),
      prisma.agentReflection.count({ where: { passed: true } }),
      prisma.agentReflection.count({ where: { passed: false } }),
      prisma.agentReflection.aggregate({ _avg: { score: true } }),
    ]);

    return {
      totalReflections: total,
      passed,
      failed,
      passRate: total > 0 ? (passed / total * 100).toFixed(1) + '%' : '0%',
      averageScore: avgScore._avg.score?.toFixed(2) || '0',
    };
  }

  async recordFeedback(taskId: string, predictedScore: number, actualScore: number, corrected: boolean, userFeedback?: string): Promise<void> {
    this.engine.recordFeedback({ taskId, predictedScore, actualScore, corrected, userFeedback, timestamp: Date.now() });
    this.logger.debug(`Feedback for ${taskId}: predicted=${predictedScore}, actual=${actualScore}, corrected=${corrected}`);
  }

  async getCalibration(): Promise<any> {
    return this.engine.getConfidenceCalibration();
  }

  async getAlternative(taskDescription: string, previousError?: string, retryCount = 0): Promise<string> {
    const task: AgentTaskDef = {
      id: 'suggestion',
      description: taskDescription,
      requiredCapabilities: [],
      retryCount,
      maxRetries: 3,
      priority: 0,
      dependencies: [],
      estimatedComplexity: 0.5,
      status: 'pending',
      createdAt: Date.now(),
    };
    return this.engine.suggestAlternative(task, previousError);
  }
}
