import { Event } from '@nexora/shared';

export class ProjectDeletedEvent extends Event {
  constructor(
    aggregateId: string,
    payload: { name: string; userId: string },
  ) {
    super(aggregateId, 'project', 'ProjectDeleted', payload);
  }
}
