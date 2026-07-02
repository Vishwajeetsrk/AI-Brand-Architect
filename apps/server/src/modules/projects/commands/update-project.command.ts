import { ICommand } from '@nestjs/cqrs';
import { UpdateProjectDto } from '../dto/update-project.dto';

export class UpdateProjectCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateProjectDto,
    public readonly userId: string,
  ) {}
}
