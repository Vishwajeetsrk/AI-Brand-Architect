import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyzeDocumentDto {
  @ApiProperty({ example: 'https://example.com/doc.pdf' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: 'pdf' })
  @IsOptional()
  @IsString()
  type?: 'pdf' | 'docx' | 'image' | 'txt';
}

export class ExtractDataDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: ['dates', 'names', 'amounts'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
}

export class ClassifyDocumentDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: ['invoice', 'contract', 'report', 'email'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}

export class CompareDocumentsDto {
  @ApiProperty()
  @IsString()
  sourceUrl: string;

  @ApiProperty()
  @IsString()
  targetUrl: string;
}
