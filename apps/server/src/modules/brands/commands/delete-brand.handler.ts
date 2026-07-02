import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BrandsService } from '../brands.service';
import { EventBusService } from '../../cqrs/event-bus.service';
import { EventStoreService } from '../../cqrs/event-store.service';
import { DeleteBrandCommand } from './delete-brand.command';
import { BrandDeletedEvent } from '../events/brand-deleted.event';

@CommandHandler(DeleteBrandCommand)
export class DeleteBrandHandler implements ICommandHandler<DeleteBrandCommand> {
  constructor(
    private readonly brandsService: BrandsService,
    private readonly eventBus: EventBusService,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(command: DeleteBrandCommand) {
    const brand = await this.brandsService.getBrand(command.userId, command.id);

    await this.brandsService.deleteBrand(command.userId, command.id);

    const event = new BrandDeletedEvent(command.id, {
      name: brand.name,
      userId: command.userId,
    });

    await this.eventStore.append(event);
    await this.eventBus.publish(event);

    return { success: true };
  }
}
