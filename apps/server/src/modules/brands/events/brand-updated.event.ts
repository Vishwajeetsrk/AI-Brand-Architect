import { Event } from '@nexora/shared';

export class BrandUpdatedEvent extends Event {
  constructor(
    public readonly aggregateId: string,
    payload: { changes: Record<string, unknown>; userId: string },
  ) {
    super(aggregateId, 'brand', 'BrandUpdated', payload);
  }
}
