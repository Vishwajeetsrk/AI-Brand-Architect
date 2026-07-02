import { IsString, IsIn, IsObject, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ description: 'Report name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['gdpr', 'soc2', 'hipaa', 'custom'], description: 'Compliance type' })
  @IsString()
  @IsIn(['gdpr', 'soc2', 'hipaa', 'custom'])
  type: 'gdpr' | 'soc2' | 'hipaa' | 'custom';

  @ApiProperty({ description: 'Date range for the report' })
  @IsObject()
  @IsNotEmpty()
  dateRange: { start: string; end: string };
}

export class AuditLogFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by action' })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({ description: 'Filter by entity type' })
  @IsOptional()
  @IsString()
  entityType?: string;
}
