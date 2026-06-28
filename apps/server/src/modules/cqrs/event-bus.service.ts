import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IEventBus } from '@nexora/shared';
import { Event } from '@nexora/shared';

@Injectable()
export class EventBusService implements IEventBus {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(event: Event): Promise<void> {
    this.eventEmitter.emit(event.type, event);
  }

  async publishAll(events: Event[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  subscribe<T extends Event>(eventType: string, handler: { handle: (event: T) => Promise<void> }): void {
    this.eventEmitter.on(eventType, (event: T) => handler.handle(event));
  }
}
