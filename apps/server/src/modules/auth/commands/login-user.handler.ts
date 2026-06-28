import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { EventBusService } from '../../cqrs/event-bus.service';
import { EventStoreService } from '../../cqrs/event-store.service';
import { LoginUserCommand } from './login-user.command';
import { UserLoggedInEvent } from '../events/user-logged-in.event';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly eventBus: EventBusService,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(command: LoginUserCommand) {
    const result = await this.authService.login(
      { email: command.email, password: command.password },
      command.ipAddress,
      command.userAgent,
    );

    const event = new UserLoggedInEvent(result.userId, {
      email: result.email,
      ipAddress: command.ipAddress,
      userAgent: command.userAgent,
    });

    await this.eventStore.append(event);
    await this.eventBus.publish(event);

    return result;
  }
}
