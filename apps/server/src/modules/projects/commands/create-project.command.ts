import { ICommand } from '@nestjs/cqrs';
import { CreateProjectDto } from '../dto/create-project.dto';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly dto: CreateProjectDto,
    public readonly userId: string,
  ) {}
}
