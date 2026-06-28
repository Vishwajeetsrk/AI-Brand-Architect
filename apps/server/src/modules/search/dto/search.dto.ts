import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min, Max, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum SearchQueryMode {
  KEYWORD = 'keyword',
  SEMANTIC = 'semantic',
  HYBRID = 'hybrid',
}

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query string' })
  @IsString()
  q: string;

  @ApiPropertyOptional({ enum: SearchQueryMode, default: SearchQueryMode.KEYWORD })
  @IsOptional()
  @IsEnum(SearchQueryMode)
  mode?: SearchQueryMode;

  @ApiPropertyOptional({ description: 'Filter by entity types (comma-separated)' })
  @IsOptional()
  @IsString()
  types?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minScore?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  visibility?: string;
}

export class IndexDocumentDto {
  @ApiProperty({ enum: ['BRAND', 'PROJECT', 'ASSET', 'USER', 'KNOWLEDGE', 'CONVERSATION', 'MARKETPLACE', 'COMPONENT', 'TEMPLATE', 'NOTE', 'ORGANIZATION'] })
  @IsString()
  entityType: string;

  @ApiProperty()
  @IsString()
  entityId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  visibility?: string;
}

export class SearchResultItemDto {
  @ApiProperty() id: string;
  @ApiProperty() entityType: string;
  @ApiProperty() entityId: string;
  @ApiProperty() title: string;
  @ApiPropertyOptional() description?: string;
  @ApiPropertyOptional() content?: string;
  @ApiProperty() tags: string[];
  @ApiPropertyOptional() metadata?: Record<string, any>;
  @ApiProperty() score: number;
  @ApiPropertyOptional() userId?: string;
  @ApiPropertyOptional() organizationId?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class SearchResultsDto {
  @ApiProperty({ type: [SearchResultItemDto] })
  items: SearchResultItemDto[];

  @ApiProperty() total: number;
  @ApiProperty() limit: number;
  @ApiProperty() offset: number;
  @ApiProperty() query: string;
  @ApiProperty({ enum: SearchQueryMode }) mode: SearchQueryMode;
  @ApiProperty() took: number;
}
