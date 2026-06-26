import { AgentConfig, AgentContext, AgentTask, AgentExecutionPlan, AgentExecutionResult, LLMMessage } from '../types';
import { getProvider } from '../llm/provider-factory';
import { PromptEngine } from '../prompt/prompt-engine';
import { MemoryStore } from '../memory/memory-store';
import { SkillRegistry } from './skill-registry';

export class AgentRuntime {
  private promptEngine: PromptEngine;
  private memoryStore: MemoryStore;
  private skillRegistry: SkillRegistry;

  constructor() {
    this.promptEngine = new PromptEngine();
    this.memoryStore = new MemoryStore();
    this.skillRegistry = new SkillRegistry();
    this.promptEngine.loadDefaultTemplates();
  }

  getPromptEngine(): PromptEngine {
    return this.promptEngine;
  }

  getMemoryStore(): MemoryStore {
    return this.memoryStore;
  }

  getSkillRegistry(): SkillRegistry {
    return this.skillRegistry;
  }

  async execute(config: AgentConfig, context: AgentContext, input: string, apiKey?: string): Promise<AgentExecutionResult> {
    const start = Date.now();
    const apiKeyToUse = apiKey || config.model.apiKey;

    await this.recordSessionContext(config, context, input, apiKeyToUse);

    const plan = await this.createPlan(config, context, input, apiKeyToUse);
    plan.status = 'executing';

    const tokenUsage = { total: 0, byTask: {} as Record<string, number> };

    for (const task of plan.tasks) {
      if (task.status === 'completed') continue;
      task.status = 'running';

      try {
        const result = await this.executeTask(config, context, task, apiKeyToUse);
        task.status = 'completed';
        task.result = result.content;
        tokenUsage.total += result.usage?.totalTokens || 0;
        tokenUsage.byTask[task.id] = result.usage?.totalTokens || 0;
      } catch (error) {
        task.status = 'failed';
        task.error = (error as Error).message;
      }
    }

    const finalOutput = await this.synthesizeOutput(config, context, plan, apiKeyToUse);
    plan.status = 'completed';
    plan.completedAt = Date.now();

    return {
      plan,
      finalOutput,
      duration: Date.now() - start,
      tokenUsage,
    };
  }

  private async createPlan(config: AgentConfig, context: AgentContext, input: string, apiKey?: string): Promise<AgentExecutionPlan> {
    const skillsDescription = config.skills.length > 0
      ? `Available skills: ${config.skills.join(', ')}`
      : 'No specialized skills available. Use general reasoning.';

    const messages: LLMMessage[] = [
      { role: 'system', content: `${config.systemPrompt}\n\nYou are creating a step-by-step execution plan. Break down the goal into clear, sequential tasks. Each task should be actionable and specific.` },
      { role: 'user', content: `Create a detailed execution plan for: ${input}\n\n${skillsDescription}\n\nOrganization: ${context.organizationId || 'N/A'}\nBrand: ${context.brandId || 'N/A'}\n\nReturn the plan as a numbered list of tasks.` },
    ];

    const provider = getProvider(config.model.provider, apiKey);
    const response = await provider.generateText(messages, { temperature: 0.3, model: config.model.model });

    return {
      id: crypto.randomUUID(),
      goal: input,
      tasks: this.parseTasks(response.content),
      status: 'planning',
      createdAt: Date.now(),
    };
  }

  private parseTasks(planText: string): AgentTask[] {
    const lines = planText.split('\n').filter(l => l.trim());
    const tasks: AgentTask[] = [];
    let currentTask: Partial<AgentTask> | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      const taskMatch = trimmed.match(/^(?:\d+[\.\)]|[-*])\s*(.+)/);
      if (taskMatch) {
        if (currentTask && currentTask.description) {
          tasks.push(this.finalizeTask(currentTask, tasks.length));
        }
        currentTask = { description: taskMatch[1].trim() };
      } else if (currentTask) {
        currentTask.description = (currentTask.description || '') + ' ' + trimmed;
      }
    }

    if (currentTask && currentTask.description) {
      tasks.push(this.finalizeTask(currentTask, tasks.length));
    }

    if (tasks.length === 0) {
      tasks.push(this.finalizeTask({ description: planText }, 0));
    }

    return tasks;
  }

  private finalizeTask(task: Partial<AgentTask>, index: number): AgentTask {
    return {
      id: `task-${index}`,
      description: (task.description || '').trim(),
      priority: index,
      dependencies: index > 0 ? [`task-${index - 1}`] : [],
      status: 'pending',
    };
  }

  private async executeTask(config: AgentConfig, context: AgentContext, task: AgentTask, apiKey?: string): Promise<{ content: string; usage?: { totalTokens: number } }> {
    const relevantMemories = await this.memoryStore.search(task.description, 3, undefined, apiKey);
    const memoryContext = relevantMemories.map(m => m.content).join('\n');

    const skillContext = this.buildSkillContext(config, task);

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: `${config.systemPrompt}\n\n${memoryContext ? `Relevant context from memory:\n${memoryContext}\n` : ''}${skillContext}`,
      },
      { role: 'user', content: task.description },
    ];

    const provider = getProvider(config.model.provider, apiKey);
    const response = await provider.generateText(messages, {
      temperature: config.temperature,
      model: config.model.model,
    });

    // Fix: Don't pass timestamp, let memory-store handle it
    await this.memoryStore.store({
      id: crypto.randomUUID(),
      type: 'short_term',
      content: `Task: ${task.description}\nResult: ${response.content}`,
      metadata: { taskId: task.id, agentId: config.id, sessionId: context.sessionId },
    }, apiKey);

    return { content: response.content, usage: response.usage };
  }

  private buildSkillContext(config: AgentConfig, task: AgentTask): string {
    const relevantSkills = this.skillRegistry
      .getSkillsByNames(config.skills)
      .filter(s => task.description.toLowerCase().includes(s.name.toLowerCase().replace(/_/g, ' ')));

    if (relevantSkills.length === 0) return '';

    return `Available tools for this task:\n${relevantSkills.map(s => `- ${s.name}: ${s.description}`).join('\n')}`;
  }

  private async synthesizeOutput(config: AgentConfig, context: AgentContext, plan: AgentExecutionPlan, apiKey?: string): Promise<string> {
    const completedTasks = plan.tasks.filter(t => t.status === 'completed');
    const failedTasks = plan.tasks.filter(t => t.status === 'failed');

    if (completedTasks.length === 0) {
      return `Execution failed. ${failedTasks.length} task(s) encountered errors.\n\nErrors:\n${failedTasks.map(t => `- ${t.description}: ${t.error}`).join('\n')}`;
    }

    const taskResults = completedTasks.map(t => `## ${t.description}\n${t.result}`).join('\n\n');
    const failureNote = failedTasks.length > 0
      ? `\n\nNote: ${failedTasks.length} task(s) failed:\n${failedTasks.map(t => `- ${t.description}: ${t.error}`).join('\n')}`
      : '';

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: 'You are a synthesis engine. Combine the following task results into a cohesive, well-structured final output that directly addresses the original goal.',
      },
      {
        role: 'user',
        content: `Original Goal: ${plan.goal}\n\nCompleted Task Results:\n${taskResults}${failureNote}\n\nSynthesize these results into a comprehensive final output.`,
      },
    ];

    const provider = getProvider(config.model.provider, apiKey);
    const response = await provider.generateText(messages, {
      temperature: 0.3,
      model: config.model.model,
    });

    return response.content;
  }

  private async recordSessionContext(config: AgentConfig, context: AgentContext, input: string, apiKey?: string): Promise<void> {
    // Fix: Don't pass timestamp, let memory-store handle it
    await this.memoryStore.store({
      id: `session-${context.sessionId}`,
      type: 'working',
      content: `Session started. Agent: ${config.name} (${config.type}). User: ${context.userId}. Input: ${input}`,
      metadata: {
        agentId: config.id,
        agentType: config.type,
        userId: context.userId,
        sessionId: context.sessionId,
        projectId: context.projectId,
        brandId: context.brandId,
        input,
      },
    }, apiKey);
  }
}
