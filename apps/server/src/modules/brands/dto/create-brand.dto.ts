import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ example: 'Nexora' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'AI-powered brand architect platform' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '#6366F1' })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({ example: 'Technology' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ example: ['innovative', 'modern', 'reliable'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}
