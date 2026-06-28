import type { Event } from './event';

export interface StoredEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  type: string;
  payload: Record<string, unknown>;
  version: number;
  occurredAt: Date;
}

export interface IEventStore {
  append(event: Event, version?: number): Promise<void>;
  getEvents(aggregateId: string): Promise<StoredEvent[]>;
  getEventsByType(type: string, since?: Date): Promise<StoredEvent[]>;
  replay(aggregateId: string, target: Record<string, unknown>): Promise<void>;
}
