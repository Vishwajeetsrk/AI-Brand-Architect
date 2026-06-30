import { IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AwardPointsDto {
  @ApiProperty() @IsString() userId: string;
  @ApiProperty() @IsNumber() points: number;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class CreateAchievementDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() pointsRequired?: number;
}
