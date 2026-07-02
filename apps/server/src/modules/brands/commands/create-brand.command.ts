import { ICommand } from '@nestjs/cqrs';
import { CreateBrandDto } from '../dto/create-brand.dto';

export class CreateBrandCommand implements ICommand {
  constructor(
    public readonly dto: CreateBrandDto,
    public readonly userId: string,
    public readonly organizationId: string,
  ) {}
}
