import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePromptDto {
  @ApiProperty({ example: 'Brand Voice Generator' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'You are a brand voice expert. Generate a brand voice profile for: {{brandName}}' })
  @IsString()
  template: string;

  @ApiPropertyOptional({ example: 'Generate brand voice from brand description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'gpt-4o' })
  @IsOptional()
  @IsString()
  defaultModel?: string;

  @ApiPropertyOptional({ example: 0.8 })
  @IsOptional()
  temperature?: number;
}
