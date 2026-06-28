import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AgentSkillResult {
  @ApiProperty()
  skillName: string;

  @ApiProperty()
  output: any;

  @ApiProperty()
  executionTimeMs: number;
}

export class AgentResponseDto {
  @ApiProperty()
  agentId: string;

  @ApiProperty()
  agentName: string;

  @ApiProperty()
  input: string;

  @ApiProperty()
  output: string;

  @ApiPropertyOptional({ type: [AgentSkillResult] })
  skillResults?: AgentSkillResult[];

  @ApiProperty()
  executionTimeMs: number;

  @ApiProperty()
  model: string;

  @ApiPropertyOptional()
  reflection?: any;
}
