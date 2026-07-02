import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectsService } from '../projects.service';
import { EventBusService } from '../../cqrs/event-bus.service';
import { EventStoreService } from '../../cqrs/event-store.service';
import { CreateProjectCommand } from './create-project.command';
import { ProjectCreatedEvent } from '../events/project-created.event';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly eventBus: EventBusService,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(command: CreateProjectCommand) {
    const project = await this.projectsService.createProject(command.userId, command.dto);

    const event = new ProjectCreatedEvent(project.id, {
      name: project.name,
      userId: command.userId,
      organizationId: project.organizationId,
    });

    await this.eventStore.append(event);
    await this.eventBus.publish(event);

    return project;
  }
}
