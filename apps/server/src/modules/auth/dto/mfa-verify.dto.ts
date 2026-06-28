import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaVerifyDto {
  @ApiProperty()
  @IsString()
  token: string;
}
