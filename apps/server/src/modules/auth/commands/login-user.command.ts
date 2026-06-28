import { Command } from '@nexora/shared';
import type { AuthResponseDto } from '../dto/auth-response.dto';

export class LoginUserCommand extends Command<AuthResponseDto> {
  readonly type = 'LoginUser';
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
  ) { super(); }
}
