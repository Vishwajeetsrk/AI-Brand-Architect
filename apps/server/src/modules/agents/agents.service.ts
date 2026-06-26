import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AgentRuntime, AgentConfig } from './agent.runtime';
import { CreateAgentDto } from './dto/create-agent.dto';
import { ExecuteAgentDto } from './dto/execute-agent.dto';
import { AgentResponseDto } from './dto/agent-response.dto';

@Injectable()
export class AgentsService {
  private agents: AgentConfig[] = [];

  constructor(private readonly agentRuntime: AgentRuntime) {}

  create(dto: CreateAgentDto, userId: string): AgentConfig {
    const agent: AgentConfig = {
      id: uuidv4(),
      name: dto.name,
      agentType: dto.agentType,
      description: dto.description || '',
      skills: dto.skills || ['brand-analysis'],
      model: dto.model || 'gpt-4o',
      temperature: dto.temperature ?? 0.7,
    };
    this.agents.push(agent);
    return agent;
  }

  findAll(userId?: string): AgentConfig[] {
    return this.agents;
  }

  findOne(id: string): AgentConfig {
    const agent = this.agents.find((a) => a.id === id);
    if (!agent) {
      throw new NotFoundException(`Agent with id ${id} not found`);
    }
    return agent;
  }

  async execute(id: string, dto: ExecuteAgentDto): Promise<AgentResponseDto> {
    const agent = this.findOne(id);
    return this.agentRuntime.execute(agent, dto);
  }

  remove(id: string): void {
    const index = this.agents.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Agent with id ${id} not found`);
    }
    this.agents.splice(index, 1);
  }
}
