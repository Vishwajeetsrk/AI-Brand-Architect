import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BrandsService } from '../brands.service';
import { GetBrandQuery } from './get-brand.query';

@QueryHandler(GetBrandQuery)
export class GetBrandHandler implements IQueryHandler<GetBrandQuery> {
  constructor(private readonly brandsService: BrandsService) {}

  async execute(query: GetBrandQuery) {
    return this.brandsService.getBrand(query.userId, query.id);
  }
}
