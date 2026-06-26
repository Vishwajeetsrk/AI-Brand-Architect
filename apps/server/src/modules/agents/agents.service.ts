import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { BrandAnalysisSkill, ContentGenerationSkill, MarketResearchSkill } from '@nexora/ai-engine';
import { AgentRuntime, AgentConfig } from './agent.runtime';
import { CreateAgentDto } from './dto/create-agent.dto';
import { ExecuteAgentDto } from './dto/execute-agent.dto';
import { AgentResponseDto } from './dto/agent-response.dto';

function toPrismaAgentType(type: string): string {
  const map: Record<string, string> = {
    'brand-analyst': 'BRAND',
    'content-creator': 'CONTENT',
    'strategist': 'MARKETING',
    'custom': 'CUSTOM',
  };
  return map[type] || 'CUSTOM';
}

@Injectable()
export class AgentsService {
  constructor(private readonly agentRuntime: AgentRuntime) {}

  async create(dto: CreateAgentDto, userId: string): Promise<any> {
    return prisma.agent.create({
      data: {
        name: dto.name,
        type: toPrismaAgentType(dto.agentType) as any,
        description: dto.description || '',
        skills: dto.skills || ['brand-analysis'],
        config: { model: dto.model || 'gpt-4o', temperature: dto.temperature ?? 0.7 },
        userId,
      },
    });
  }

  async findAll(userId?: string): Promise<any> {
    const where = userId ? { userId } : {};
    return prisma.agent.findMany({ where });
  }

  async findOne(id: string): Promise<any> {
    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException(`Agent with id ${id} not found`);
    return agent;
  }

  async execute(id: string, dto: ExecuteAgentDto): Promise<AgentResponseDto> {
    const agent = await this.findOne(id);
    const config: AgentConfig = {
      id: agent.id,
      name: agent.name,
      agentType: agent.type as string,
      description: agent.description || '',
      skills: agent.skills,
      model: (agent.config as any)?.model || 'gpt-4o',
      temperature: (agent.config as any)?.temperature ?? 0.7,
    };
    return this.agentRuntime.execute(config, dto);
  }

  async remove(id: string): Promise<void> {
    const agent = await this.findOne(id);
    await prisma.agent.delete({ where: { id: agent.id } });
  }
}
