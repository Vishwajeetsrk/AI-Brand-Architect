import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCareerRoadmapDto {
  @ApiProperty() @IsString() currentRole: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) skills?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() industry?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() experienceYears?: number;
}
