import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AgentType {
  BRAND_ANALYST = 'brand-analyst',
  CONTENT_CREATOR = 'content-creator',
  STRATEGIST = 'strategist',
  CUSTOM = 'custom',
}

export class CreateAgentDto {
  @ApiProperty({ example: 'Brand Analyst Pro' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AgentType, default: AgentType.CUSTOM })
  @IsEnum(AgentType)
  agentType: AgentType;

  @ApiPropertyOptional({ example: 'Analyzes brand identity and provides recommendations' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['brand-analysis', 'content-generation'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ example: 'gpt-4o' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 0.7 })
  @IsOptional()
  temperature?: number;
}
