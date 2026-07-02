import { Event } from '@nexora/shared';

export class BrandDeletedEvent extends Event {
  constructor(
    public readonly aggregateId: string,
    payload: { name: string; userId: string },
  ) {
    super(aggregateId, 'brand', 'BrandDeleted', payload);
  }
}
