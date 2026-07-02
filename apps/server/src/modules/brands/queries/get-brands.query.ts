import { IQuery } from '@nestjs/cqrs';

export class GetBrandsQuery implements IQuery {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly search?: string,
  ) {}
}
