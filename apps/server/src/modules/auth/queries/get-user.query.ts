import { Query } from '@nexora/shared';

export interface UserProfile {
  id: string; email: string; name: string; role: string; avatar: string | null; mfaEnabled: boolean; emailVerified: boolean;
}

export class GetUserQuery extends Query<UserProfile | null> {
  readonly type = 'GetUser';
  constructor(public readonly userId: string) { super(); }
}
