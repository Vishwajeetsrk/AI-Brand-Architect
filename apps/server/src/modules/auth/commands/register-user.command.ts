import { Command } from '@nexora/shared';
import type { AuthResponseDto } from '../dto/auth-response.dto';

export class RegisterUserCommand extends Command<AuthResponseDto> {
  readonly type = 'RegisterUser';
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
    public readonly organizationName?: string,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
  ) { super(); }
}
