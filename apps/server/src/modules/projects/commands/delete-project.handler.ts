import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectsService } from '../projects.service';
import { EventBusService } from '../../cqrs/event-bus.service';
import { EventStoreService } from '../../cqrs/event-store.service';
import { DeleteProjectCommand } from './delete-project.command';
import { ProjectDeletedEvent } from '../events/project-deleted.event';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly eventBus: EventBusService,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(command: DeleteProjectCommand) {
    const project = await this.projectsService.getProject(command.userId, command.id);

    await this.projectsService.deleteProject(command.userId, command.id);

    const event = new ProjectDeletedEvent(command.id, {
      name: project.name,
      userId: command.userId,
    });

    await this.eventStore.append(event);
    await this.eventBus.publish(event);

    return { success: true };
  }
}
