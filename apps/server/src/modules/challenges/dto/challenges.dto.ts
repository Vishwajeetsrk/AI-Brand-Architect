import { IsString, IsOptional, IsArray, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChallengeDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() language: string;
  @ApiProperty() @IsString() difficulty: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) topics?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() starterCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() solution?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() testCases?: { input: string; expected: string }[];
}

export class SubmitSolutionDto {
  @ApiProperty() @IsString() challengeId: string;
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() language: string;
}
