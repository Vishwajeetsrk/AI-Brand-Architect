import { ICommand } from '@nestjs/cqrs';
import { UpdateBrandDto } from '../dto/update-brand.dto';

export class UpdateBrandCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateBrandDto,
    public readonly userId: string,
  ) {}
}
