import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MfaSetupDto {
  @ApiPropertyOptional({ default: 'totp' })
  @IsOptional()
  @IsString()
  type?: string;
}
