import { IQuery } from '@nestjs/cqrs';

export class GetProjectsQuery implements IQuery {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
  ) {}
}
