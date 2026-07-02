import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BrandsService } from '../brands.service';
import { EventBusService } from '../../cqrs/event-bus.service';
import { EventStoreService } from '../../cqrs/event-store.service';
import { CreateBrandCommand } from './create-brand.command';
import { BrandCreatedEvent } from '../events/brand-created.event';

@CommandHandler(CreateBrandCommand)
export class CreateBrandHandler implements ICommandHandler<CreateBrandCommand> {
  constructor(
    private readonly brandsService: BrandsService,
    private readonly eventBus: EventBusService,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(command: CreateBrandCommand) {
    const brand = await this.brandsService.createBrand(command.userId, command.dto);

    const event = new BrandCreatedEvent(brand.id, {
      name: brand.name,
      userId: command.userId,
      organizationId: command.organizationId,
    });

    await this.eventStore.append(event);
    await this.eventBus.publish(event);

    return brand;
  }
}
