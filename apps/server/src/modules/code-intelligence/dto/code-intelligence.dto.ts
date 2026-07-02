import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateCodeDto {
  @ApiProperty({ description: 'Prompt describing the code to generate' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ description: 'Target programming language' })
  @IsString()
  @IsNotEmpty()
  language: string;
}

export class ReviewCodeDto {
  @ApiProperty({ description: 'Source code to review' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Programming language of the code' })
  @IsString()
  @IsNotEmpty()
  language: string;
}

export class ExplainCodeDto {
  @ApiProperty({ description: 'Source code to explain' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Programming language of the code' })
  @IsString()
  @IsNotEmpty()
  language: string;
}

export class RefactorCodeDto {
  @ApiProperty({ description: 'Source code to refactor' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Refactoring instructions' })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty({ description: 'Programming language of the code' })
  @IsString()
  @IsNotEmpty()
  language: string;
}
