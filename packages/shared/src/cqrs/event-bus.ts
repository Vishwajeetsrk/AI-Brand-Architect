import type { Event } from './event';
import type { EventHandler } from './event';

export interface IEventBus {
  publish(event: Event): Promise<void>;
  publishAll(events: Event[]): Promise<void>;
  subscribe<T extends Event>(eventType: string, handler: EventHandler<T>): void;
}
