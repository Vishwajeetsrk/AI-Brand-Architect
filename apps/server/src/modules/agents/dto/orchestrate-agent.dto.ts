import { IsString, IsOptional, IsArray, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CoordinationStrategy {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  SWARM = 'swarm',
  PIPELINE = 'pipeline',
  HIERARCHY = 'hierarchy',
  DEBATE = 'debate',
  CONSENSUS = 'consensus',
}

export class OrchestrateAgentDto {
  @ApiProperty({ example: 'Analyze brand identity and generate marketing content' })
  @IsString()
  goal: string;

  @ApiProperty({ example: ['agent-id-1', 'agent-id-2'], description: 'Agent IDs to orchestrate' })
  @IsArray()
  @IsString({ each: true })
  agentIds: string[];

  @ApiPropertyOptional({ enum: CoordinationStrategy, default: CoordinationStrategy.SEQUENTIAL })
  @IsOptional()
  @IsEnum(CoordinationStrategy)
  strategy?: CoordinationStrategy;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}

export class ShareMemoryDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsObject()
  value: Record<string, unknown>;

  @ApiPropertyOptional({ default: 'team' })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class AgentOSStatsDto {
  agents: { total: number; byRole: Record<string, number>; byStatus: Record<string, number> };
  scheduler: { queued: number; executing: number; completed: number; failed: number };
  memory: { total: number; byScope: Record<string, number>; byOwner: Record<string, number> };
}
