import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyzeImageDto {
  @ApiProperty({ description: 'URL of the image to analyze' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}

export class GenerateImageDto {
  @ApiProperty({ description: 'Text prompt for image generation' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({ description: 'Style hint for generated image' })
  @IsOptional()
  @IsString()
  style?: string;
}
