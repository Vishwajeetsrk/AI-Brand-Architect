import { Event } from '@nexora/shared';

export class ProjectCreatedEvent extends Event {
  constructor(
    aggregateId: string,
    payload: { name: string; userId: string; organizationId?: string },
  ) {
    super(aggregateId, 'project', 'ProjectCreated', payload);
  }
}
