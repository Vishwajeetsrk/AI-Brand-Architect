import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AgentOS, AgentRegistry, CommunicationBus, MemoryStore, SharedAgentMemory, CoordinationStrategy } from '@nexora/ai-engine';
import { OrchestrateAgentDto, ShareMemoryDto, AgentOSStatsDto } from './dto/orchestrate-agent.dto';

@Injectable()
export class AgentOSService {
  private readonly logger = new Logger(AgentOSService.name);
  private os: AgentOS;
  private sharedMemory: SharedAgentMemory;
  private memoryStore: MemoryStore;

  constructor() {
    this.memoryStore = new MemoryStore();
    this.os = new AgentOS();
    this.sharedMemory = new SharedAgentMemory(this.os.bus, this.memoryStore);
  }

  getAgentOS(): AgentOS {
    return this.os;
  }

  getSharedMemory(): SharedAgentMemory {
    return this.sharedMemory;
  }

  async orchestrate(dto: OrchestrateAgentDto): Promise<{ planId: string; results: string[]; reflection: any[] }> {
    const goal = await this.os.createGoal(dto.goal, {
      context: dto.context as Record<string, unknown>,
    });
    const plan = await this.os.planGoal(goal.id);
    const result = await this.os.executePlan(plan.id, {
      strategy: (dto.strategy || 'sequential') as any,
    });
    return {
      planId: plan.id,
      results: result.results,
      reflection: result.reflection,
    };
  }

  async shareMemory(agentId: string, dto: ShareMemoryDto): Promise<void> {
    const agent = this.os.registry.get(agentId);
    if (!agent) throw new NotFoundException(`Agent ${agentId} not registered`);
    await this.sharedMemory.share(agentId, dto.key, dto.value, (dto.scope || 'team') as any, dto.tags);
  }

  async getMemory(key: string): Promise<any> {
    const entry = this.sharedMemory.recall(key);
    return entry || null;
  }

  async searchMemory(query: string): Promise<any[]> {
    return this.sharedMemory.search(query);
  }

  getStats(): AgentOSStatsDto {
    const agentStats = this.os.getStats();
    const memoryStats = this.sharedMemory.getStats();
    return {
      agents: agentStats.agents,
      scheduler: agentStats.scheduler,
      memory: memoryStats,
    };
  }

  async getAgentProfiles(): Promise<any[]> {
    return this.os.registry.getAll().map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      status: a.status,
      capabilities: a.capabilities,
      lastHeartbeat: a.lastHeartbeat,
    }));
  }
}
