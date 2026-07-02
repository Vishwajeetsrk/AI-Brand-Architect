import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectsService } from '../projects.service';
import { EventBusService } from '../../cqrs/event-bus.service';
import { EventStoreService } from '../../cqrs/event-store.service';
import { UpdateProjectCommand } from './update-project.command';
import { ProjectUpdatedEvent } from '../events/project-updated.event';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly eventBus: EventBusService,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(command: UpdateProjectCommand) {
    const project = await this.projectsService.updateProject(command.userId, command.id, command.dto);

    const event = new ProjectUpdatedEvent(command.id, {
      changes: command.dto as Record<string, unknown>,
      userId: command.userId,
    });

    await this.eventStore.append(event);
    await this.eventBus.publish(event);

    return project;
  }
}
