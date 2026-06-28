import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { prisma } from '@nexora/database';
import { GetUserQuery } from './get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  async execute(query: GetUserQuery) {
    const user = await prisma.user.findUnique({
      where: { id: query.userId },
      select: { id: true, email: true, name: true, role: true, avatar: true, mfaEnabled: true, emailVerified: true },
    });
    return user;
  }
}
