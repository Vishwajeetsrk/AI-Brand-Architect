import { IsOptional, IsString, IsBoolean, IsObject, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFlagDto {
  @IsString() key: string;
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @IsOptional() @IsArray() tags?: string[];
}

export class UpdateFlagDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @IsOptional() @IsArray() tags?: string[];
}

export class EvaluateFlagsDto {
  @IsOptional() @IsString() userId?: string;
  @IsOptional() @IsArray() groups?: string[];
  @IsOptional() @IsString() environment?: string;
}
