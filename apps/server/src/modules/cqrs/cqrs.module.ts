import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CqrsModule as NestCqrsModule } from '@nestjs/cqrs';
import { EventStoreService } from './event-store.service';
import { EventBusService } from './event-bus.service';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: false, delimiter: '.', verboseMemoryLeak: true }),
    NestCqrsModule,
  ],
  providers: [EventStoreService, EventBusService],
  exports: [EventStoreService, EventBusService, NestCqrsModule],
})
export class CqrsModule {}
