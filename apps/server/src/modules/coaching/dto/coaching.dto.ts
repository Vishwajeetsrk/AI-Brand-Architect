import { IsString, IsOptional, IsArray, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() coachName?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) topics?: string[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() duration?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() scheduledAt?: string;
}

export class ScheduleSessionDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsDateString() scheduledAt: string;
  @ApiProperty() @IsNumber() duration: number;
  @ApiPropertyOptional() @IsOptional() @IsString() coachName?: string;
}
