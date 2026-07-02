import { Event } from '@nexora/shared';

export class BrandCreatedEvent extends Event {
  constructor(
    public readonly aggregateId: string,
    payload: { name: string; userId: string; organizationId: string },
  ) {
    super(aggregateId, 'brand', 'BrandCreated', payload);
  }
}
