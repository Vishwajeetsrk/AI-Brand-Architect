import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum InviteRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export class InviteMemberDto {
  @ApiProperty({ example: 'colleague@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ default: 'MEMBER' })
  @IsOptional()
  @IsEnum(InviteRole)
  role?: InviteRole;
}
