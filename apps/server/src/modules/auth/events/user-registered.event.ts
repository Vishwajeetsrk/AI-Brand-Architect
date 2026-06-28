import { Event } from '@nexora/shared';

export class UserRegisteredEvent extends Event {
  readonly type = 'auth.user.registered';
  readonly aggregateType = 'User';

  constructor(
    public readonly aggregateId: string,
    public readonly payload: { email: string; name: string; role: string; organizationName?: string },
  ) { super(); }
}
