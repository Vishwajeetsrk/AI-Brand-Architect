import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchKnowledgeDto {
  @ApiProperty({ example: 'What is the brand voice for Nexora?' })
  @IsString()
  query: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  topK?: number;

  @ApiPropertyOptional({ example: 0.7 })
  @IsOptional()
  @IsNumber()
  similarityThreshold?: number;
}
