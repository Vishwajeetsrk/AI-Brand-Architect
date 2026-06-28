import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OAuthCallbackDto {
  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  redirectUri?: string;
}
