import { Event } from '@nexora/shared';

export class UserLoggedInEvent extends Event {
  readonly type = 'auth.user.logged_in';
  readonly aggregateType = 'User';

  constructor(
    public readonly aggregateId: string,
    public readonly payload: { email: string; ipAddress?: string; userAgent?: string },
  ) { super(); }
}
