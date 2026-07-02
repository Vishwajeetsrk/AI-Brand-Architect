import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BrandsService } from '../brands.service';
import { GetBrandsQuery } from './get-brands.query';

@QueryHandler(GetBrandsQuery)
export class GetBrandsHandler implements IQueryHandler<GetBrandsQuery> {
  constructor(private readonly brandsService: BrandsService) {}

  async execute(query: GetBrandsQuery) {
    return this.brandsService.getBrands(query.userId, query.organizationId);
  }
}
