import { Event } from '@nexora/shared';

export class ProjectUpdatedEvent extends Event {
  constructor(
    aggregateId: string,
    payload: { changes: Record<string, unknown>; userId: string },
  ) {
    super(aggregateId, 'project', 'ProjectUpdated', payload);
  }
}
