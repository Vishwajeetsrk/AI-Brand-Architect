import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class EvaluateTaskDto {
  @ApiProperty()
  @IsString()
  taskId: string;

  @ApiProperty()
  @IsString()
  taskDescription: string;

  @ApiProperty()
  @IsString()
  output: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  retryCount?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  capabilities?: string[];
}

export class RecordFeedbackDto {
  @ApiProperty()
  @IsString()
  taskId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  predictedScore: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  actualScore: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userFeedback?: string;

  @ApiProperty()
  @IsBoolean()
  corrected: boolean;
}

export class ReflectionResultDto {
  @ApiProperty() id: string;
  @ApiProperty() taskId: string;
  @ApiProperty() score: number;
  @ApiProperty() passed: boolean;
  @ApiProperty({ type: [String] }) issues: string[];
  @ApiProperty({ type: [String] }) improvements: string[];
  @ApiProperty() confidence: number;
  @ApiProperty() needsRetry: boolean;
  @ApiProperty() retryCount: number;
  @ApiPropertyOptional() suggestedChanges?: string;
  @ApiProperty() createdAt: Date;
}

export class BatchEvaluateDto {
  @ApiProperty({ type: [EvaluateTaskDto] })
  tasks: EvaluateTaskDto[];
}
