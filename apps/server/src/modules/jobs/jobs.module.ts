import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { JobConsumer } from './job.consumer';
import { SchedulerService } from './scheduler.service';

const QUEUES = ['ai-generation', 'exports', 'notifications', 'billing', 'cleanup', 'reports', 'search'] as const;

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    }),
    BullModule.registerQueue(...QUEUES.map(name => ({ name }))),
  ],
  controllers: [JobsController],
  providers: [JobsService, JobConsumer, SchedulerService],
  exports: [JobsService, BullModule],
})
export class JobsModule {}
