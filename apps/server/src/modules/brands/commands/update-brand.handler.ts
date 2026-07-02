import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BrandsService } from '../brands.service';
import { EventBusService } from '../../cqrs/event-bus.service';
import { EventStoreService } from '../../cqrs/event-store.service';
import { UpdateBrandCommand } from './update-brand.command';
import { BrandUpdatedEvent } from '../events/brand-updated.event';

@CommandHandler(UpdateBrandCommand)
export class UpdateBrandHandler implements ICommandHandler<UpdateBrandCommand> {
  constructor(
    private readonly brandsService: BrandsService,
    private readonly eventBus: EventBusService,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(command: UpdateBrandCommand) {
    const brand = await this.brandsService.updateBrand(command.userId, command.id, command.dto);

    const event = new BrandUpdatedEvent(command.id, {
      changes: command.dto as Record<string, unknown>,
      userId: command.userId,
    });

    await this.eventStore.append(event);
    await this.eventBus.publish(event);

    return brand;
  }
}
