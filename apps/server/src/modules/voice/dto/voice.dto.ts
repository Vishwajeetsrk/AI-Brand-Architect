import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SynthesizeDto {
  @ApiProperty({ description: 'Text to synthesize into speech' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ description: 'Voice identifier or preset' })
  @IsOptional()
  @IsString()
  voice?: string;
}

export class TranscribeDto {
  @ApiProperty({ description: 'URL of the audio file to transcribe' })
  @IsString()
  @IsNotEmpty()
  audioUrl: string;
}

export class CloneVoiceDto {
  @ApiProperty({ description: 'Name for the cloned voice' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Array of audio sample URLs for voice cloning' })
  @IsArray()
  @IsString({ each: true })
  audioUrls: string[];
}
