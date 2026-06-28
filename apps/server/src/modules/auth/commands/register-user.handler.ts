import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { EventBusService } from '../../cqrs/event-bus.service';
import { EventStoreService } from '../../cqrs/event-store.service';
import { RegisterUserCommand } from './register-user.command';
import { UserRegisteredEvent } from '../events/user-registered.event';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly eventBus: EventBusService,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(command: RegisterUserCommand) {
    const result = await this.authService.register(
      { email: command.email, password: command.password, name: command.name, organizationName: command.organizationName },
      command.ipAddress,
      command.userAgent,
    );

    const event = new UserRegisteredEvent(result.userId, {
      email: result.email,
      name: result.name,
      role: result.role,
      organizationName: command.organizationName,
    });

    await this.eventStore.append(event);
    await this.eventBus.publish(event);

    return result;
  }
}
