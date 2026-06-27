import { CoordinationStrategy, CoordinationPlan, CoordinationStep, AgentProfile, TaskStatus } from './agentos-types';
import { CommunicationBus } from './communication-bus';
import { AgentRegistry } from './agent-registry';

export class CoordinationEngine {
  private plans: Map<string, CoordinationPlan> = new Map();
  private bus: CommunicationBus;
  private registry: AgentRegistry;

  constructor(bus: CommunicationBus, registry: AgentRegistry) {
    this.bus = bus;
    this.registry = registry;
  }

  async createPlan(
    strategy: CoordinationStrategy,
    goal: string,
    availableAgentIds: string[],
  ): Promise<CoordinationPlan> {
    const planId = crypto.randomUUID();
    const steps = await this.generateSteps(strategy, goal, availableAgentIds);

    const plan: CoordinationPlan = {
      id: planId,
      strategy,
      agents: availableAgentIds,
      goal,
      steps,
      status: 'pending',
      createdAt: Date.now(),
    };

    this.plans.set(planId, plan);
    return plan;
  }

  async executePlan(planId: string): Promise<Record<string, unknown>[]> {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Coordination plan not found: ${planId}`);

    plan.status = 'running';
    const results: Record<string, unknown>[] = [];

    switch (plan.strategy) {
      case 'sequential':
        return this.executeSequential(plan, results);
      case 'parallel':
        return this.executeParallel(plan, results);
      case 'swarm':
        return this.executeSwarm(plan, results);
      case 'pipeline':
        return this.executePipeline(plan, results);
      case 'hierarchy':
        return this.executeHierarchy(plan, results);
      case 'debate':
        return this.executeDebate(plan, results);
      case 'consensus':
        return this.executeConsensus(plan, results);
      default:
        return this.executeSequential(plan, results);
    }
  }

  getPlan(planId: string): CoordinationPlan | undefined {
    return this.plans.get(planId);
  }

  private async executeSequential(plan: CoordinationPlan, results: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    for (const step of plan.steps) {
      const result = await this.executeStep(step);
      results.push(result);
    }
    plan.status = 'completed';
    return results;
  }

  private async executeParallel(plan: CoordinationPlan, results: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    const promises = plan.steps.map(step => this.executeStep(step));
    const stepResults = await Promise.allSettled(promises);
    for (const r of stepResults) {
      results.push(r.status === 'fulfilled' ? r.value : { error: r.reason });
    }
    plan.status = 'completed';
    return results;
  }

  private async executeSwarm(plan: CoordinationPlan, results: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    const broadcast = {
      id: crypto.randomUUID(),
      fromAgentId: 'coordination-engine',
      topic: 'swarm:execute',
      type: 'broadcast' as const,
      payload: { goal: plan.goal, steps: plan.steps },
      priority: 80,
      timestamp: Date.now(),
    };

    const allAgents = plan.agents;
    const promises = allAgents.map(async (agentId) => {
      const agent = this.registry.get(agentId);
      if (!agent) return { agentId, error: 'Agent not found' };

      const response = await this.bus.request(agentId, `swarm:${plan.id}`, {
        goal: plan.goal,
        steps: plan.steps,
      });
      return { agentId, response: response.payload };
    });

    const swarmResults = await Promise.allSettled(promises);
    for (const r of swarmResults) {
      results.push(r.status === 'fulfilled' ? r.value : { error: r.reason });
    }

    const successfulResults = results.filter(r => !r.error);
    const bestResult = await this.selectBestResult(successfulResults, plan.goal);
    plan.status = 'completed';
    return bestResult ? [bestResult] : results.slice(0, 1);
  }

  private async executePipeline(plan: CoordinationPlan, results: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      if (i > 0) {
        step.input = { ...(step.input as object || {}), previousResult: results[i - 1] };
      }
      const result = await this.executeStep(step);
      results.push(result);
    }
    plan.status = 'completed';
    return results;
  }

  private async executeHierarchy(plan: CoordinationPlan, results: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    const supervisors = plan.agents.slice(0, 1);
    const workers = plan.agents.slice(1);

    for (const step of plan.steps) {
      for (const supervisorId of supervisors) {
        await this.bus.request(supervisorId, `supervise:${plan.id}`, {
          step,
          workerIds: workers,
        });
      }

      const workerPromises = workers.map(workerId =>
        this.executeStep({ ...step, agentId: workerId }),
      );
      const workerResults = await Promise.allSettled(workerPromises);
      for (const r of workerResults) {
        results.push(r.status === 'fulfilled' ? r.value : { error: r.reason });
      }
    }
    plan.status = 'completed';
    return results;
  }

  private async executeDebate(plan: CoordinationPlan, results: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    const perspectives: Record<string, unknown>[] = [];

    for (const step of plan.steps) {
      const responses = await Promise.all(
        plan.agents.map(agentId =>
          this.bus.request(agentId, `debate:${plan.id}`, {
            topic: step.action,
            context: step.input,
          }),
        ),
      );

      for (const response of responses) {
        perspectives.push({ agentId: response.fromAgentId, response: response.payload });
      }
    }

    results.push({ debate: perspectives, consensus: await this.synthesizeDebate(perspectives, plan.goal) });
    plan.status = 'completed';
    return results;
  }

  private async executeConsensus(plan: CoordinationPlan, results: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    let round = 0;
    const maxRounds = 3;
    let consensus: Record<string, unknown> | null = null;

    while (round < maxRounds && !consensus) {
      const responses = await Promise.all(
        plan.agents.map(agentId =>
          this.bus.request(agentId, `consensus:${plan.id}:round:${round}`, {
            goal: plan.goal,
            round,
            previousResults: results,
          }),
        ),
      );

      const agreements = responses.filter(r => {
        const payload = r.payload as { agree?: boolean };
        return payload?.agree === true;
      });

      if (agreements.length >= plan.agents.length * 0.67) {
        const payloads = responses.map(r => r.payload);
        results.push({ round, responses: payloads, consensus: true });
        consensus = payloads[0] as Record<string, unknown>;
      } else {
        results.push({ round, responses: responses.map(r => r.payload), consensus: false });
      }
      round++;
    }

    plan.status = 'completed';
    return results;
  }

  private async executeStep(step: CoordinationStep): Promise<Record<string, unknown>> {
    const agent = this.registry.get(step.agentId);
    if (!agent) return { stepId: step.id, error: `Agent ${step.agentId} not found` };

    const response = await this.bus.request(step.agentId, `execute:${step.id}`, {
      action: step.action,
      input: step.input,
    }, 75);

    return { stepId: step.id, agentId: step.agentId, result: response.payload };
  }

  private async selectBestResult(results: Record<string, unknown>[], goal: string): Promise<Record<string, unknown> | null> {
    if (results.length === 0) return null;
    return results.reduce((best, current) => {
      const bestScore = (best as any)?.qualityScore || 0;
      const currentScore = (current as any)?.qualityScore || 0;
      return currentScore > bestScore ? current : best;
    });
  }

  private async synthesizeDebate(perspectives: Record<string, unknown>[], goal: string): Promise<Record<string, unknown>> {
    return {
      synthesis: `Synthesized ${perspectives.length} perspectives on: ${goal}`,
      perspectives,
      timestamp: Date.now(),
    };
  }

  private async generateSteps(strategy: CoordinationStrategy, goal: string, agentIds: string[]): Promise<CoordinationStep[]> {
    switch (strategy) {
      case 'sequential':
        return agentIds.map((agentId, i) => ({
          id: `step-${i}`,
          agentId,
          action: `execute:${goal.slice(0, 50)}`,
          input: { goal, stepIndex: i, totalSteps: agentIds.length },
          dependsOn: i > 0 ? [`step-${i - 1}`] : [],
          timeout: 60000,
        }));

      case 'parallel':
        return agentIds.map((agentId, i) => ({
          id: `step-${i}`,
          agentId,
          action: `execute:${goal.slice(0, 50)}`,
          input: { goal, workerIndex: i },
          dependsOn: [],
          timeout: 60000,
        }));

      case 'pipeline':
        return agentIds.map((agentId, i) => ({
          id: `step-${i}`,
          agentId,
          action: `stage-${i}:${goal.slice(0, 50)}`,
          input: { goal, stage: i },
          dependsOn: i > 0 ? [`step-${i - 1}`] : [],
          timeout: 120000,
        }));

      case 'debate':
        return agentIds.map((agentId, i) => ({
          id: `step-${i}`,
          agentId,
          action: `debate:${goal.slice(0, 50)}`,
          input: { goal, perspective: i },
          dependsOn: [],
          timeout: 30000,
        }));

      default:
        return [{
          id: 'step-0',
          agentId: agentIds[0] || 'unknown',
          action: `execute:${goal.slice(0, 50)}`,
          input: { goal },
          dependsOn: [],
          timeout: 60000,
        }];
    }
  }
}
