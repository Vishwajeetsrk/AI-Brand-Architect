import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateContentDto {
  @ApiProperty({ example: 'brand-id-here' })
  @IsString()
  brandId: string;

  @ApiProperty({ example: 'Nexora' })
  @IsString()
  brandName: string;

  @ApiProperty({ example: 'AI-powered brand architect platform for modern enterprises' })
  @IsString()
  brandDescription: string;

  @ApiPropertyOptional({ example: 'gpt-4o' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: { tone: 'professional', industry: 'technology' } })
  @IsOptional()
  @IsObject()
  variables?: Record<string, any>;
}
