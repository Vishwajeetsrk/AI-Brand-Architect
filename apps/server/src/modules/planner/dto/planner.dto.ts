import { IsString, IsOptional, IsInt, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({ description: 'Goal description' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Priority (0-100)', default: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  priority?: number;

  @ApiPropertyOptional({ description: 'Deadline timestamp (ms)' })
  @IsOptional()
  @IsNumber()
  deadline?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  constraints?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  successCriteria?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentGoalId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  context?: Record<string, unknown>;
}

export class CreatePlanDto {
  @ApiProperty({ description: 'Available agent capabilities' })
  @IsArray()
  @IsString({ each: true })
  capabilities: string[];
}

export class UpdateTaskStatusDto {
  @ApiProperty({ description: 'New task status' })
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  result?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  error?: string;
}

export class ReplanDto {
  @ApiProperty({ description: 'ID of the failed task' })
  @IsString()
  failedTaskId: string;

  @ApiProperty({ description: 'Error message from the failure' })
  @IsString()
  error: string;

  @ApiProperty({ description: 'Available agent capabilities for replanning' })
  @IsArray()
  @IsString({ each: true })
  capabilities: string[];
}

export class ExecutePlanDto {}
