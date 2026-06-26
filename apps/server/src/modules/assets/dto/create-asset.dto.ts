import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other',
}

export class CreateAssetDto {
  @ApiProperty({ example: 'logo-final.png' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  mimeType: string;

  @ApiProperty({ example: 204800 })
  @IsNumber()
  fileSize: number;

  @ApiPropertyOptional({ example: 'https://storage.example.com/logo-final.png' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ enum: AssetType, default: AssetType.OTHER })
  @IsOptional()
  @IsEnum(AssetType)
  assetType?: AssetType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brandId?: string;
}
