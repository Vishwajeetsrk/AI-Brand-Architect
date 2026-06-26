import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Brand Identity Refresh' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Complete brand identity overhaul for Q3' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'brand-id-here' })
  @IsString()
  brandId: string;

  @ApiPropertyOptional({ example: ['logo', 'color-palette', 'typography'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
