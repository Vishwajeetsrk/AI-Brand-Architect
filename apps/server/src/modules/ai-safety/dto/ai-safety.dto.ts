import { IsOptional, IsString, IsInt, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SafetyQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() limit?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() offset?: string;
}

export class SafetyConfigDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() mode?: 'strict' | 'moderate' | 'relaxed';
  @ApiPropertyOptional() @IsOptional() throttle?: { requestsPerMinute?: number; tokensPerMinute?: number };
}

export class SafetyRuleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() detector?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() threshold?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() action?: 'block' | 'flag' | 'allow';
  @ApiPropertyOptional() @IsOptional() @IsArray() blockedCategories?: string[];
}
