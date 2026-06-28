import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';
import type { IEventStore, StoredEvent } from '@nexora/shared';
import { Event } from '@nexora/shared';

@Injectable()
export class EventStoreService implements IEventStore {
  async append(event: Event, version?: number): Promise<void> {
    const lastEvent = await prisma.eventStore.findFirst({
      where: { aggregateId: event.aggregateId, aggregateType: event.aggregateType },
      orderBy: { version: 'desc' },
    });
    const nextVersion = version ?? (lastEvent ? lastEvent.version + 1 : 1);

    await prisma.eventStore.create({
      data: {
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        type: event.type,
        payload: event.payload as any,
        version: nextVersion,
      },
    });
  }

  async getEvents(aggregateId: string): Promise<StoredEvent[]> {
    const events = await prisma.eventStore.findMany({
      where: { aggregateId },
      orderBy: { version: 'asc' },
    });
    return events.map(e => ({
      id: e.id,
      aggregateId: e.aggregateId,
      aggregateType: e.aggregateType,
      type: e.type,
      payload: e.payload as Record<string, unknown>,
      version: e.version,
      occurredAt: e.occurredAt,
    }));
  }

  async getEventsByType(type: string, since?: Date): Promise<StoredEvent[]> {
    const events = await prisma.eventStore.findMany({
      where: { type, ...(since ? { occurredAt: { gte: since } } : {}) },
      orderBy: { occurredAt: 'desc' },
    });
    return events.map(e => ({
      id: e.id,
      aggregateId: e.aggregateId,
      aggregateType: e.aggregateType,
      type: e.type,
      payload: e.payload as Record<string, unknown>,
      version: e.version,
      occurredAt: e.occurredAt,
    }));
  }

  async replay(aggregateId: string, target: Record<string, unknown>): Promise<void> {
    const events = await this.getEvents(aggregateId);
    for (const event of events) {
      Object.assign(target, event.payload);
    }
  }
}
