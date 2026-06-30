import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateThumbnailDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() style?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() brandColor?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) @Max(20) fontSize?: number;
}

export class ExecuteCodeDto {
  @ApiProperty() @IsString() language: string;
  @ApiProperty() @IsString() code: string;
  @ApiPropertyOptional() @IsOptional() @IsString() input?: string;
}
