import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from './user-registered.event';
import { UserLoggedInEvent } from './user-logged-in.event';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredEventHandler implements IEventHandler<UserRegisteredEvent> {
  async handle(event: UserRegisteredEvent) {
    console.log(`[CQRS] User registered: ${event.payload.email} (${event.aggregateId})`);
  }
}

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInEventHandler implements IEventHandler<UserLoggedInEvent> {
  async handle(event: UserLoggedInEvent) {
    console.log(`[CQRS] User logged in: ${event.payload.email}`);
  }
}
