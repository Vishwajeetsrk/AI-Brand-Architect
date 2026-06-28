import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SchedulerService implements OnModuleInit {
  constructor(
    @InjectQueue('billing') private billingQueue: Queue,
    @InjectQueue('cleanup') private cleanupQueue: Queue,
    @InjectQueue('reports') private reportsQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.registerCronJobs();
  }

  private async registerCronJobs() {
    const jobs = [
      { queue: this.billingQueue, name: 'BILLING', pattern: '0 0 1 * *', data: { action: 'generate-invoices' } },
      { queue: this.billingQueue, name: 'BILLING', pattern: '0 8 * * *', data: { action: 'payment-reminder' } },
      { queue: this.cleanupQueue, name: 'CLEANUP', pattern: '0 3 * * 0', data: { target: 'audit-logs', olderThanDays: 90 } },
      { queue: this.cleanupQueue, name: 'CLEANUP', pattern: '0 4 * * 0', data: { target: 'sessions', olderThanDays: 0 } },
      { queue: this.cleanupQueue, name: 'CLEANUP', pattern: '0 5 * * 0', data: { target: 'job-records', olderThanDays: 30 } },
      { queue: this.reportsQueue, name: 'REPORT', pattern: '0 7 1 * *', data: { type: 'monthly', organizationId: null, period: '30d' } },
    ];
    for (const job of jobs) {
      const repeatable = await this.getRepeatableJobs(job.queue);
      const exists = repeatable.some(r => r.pattern === job.pattern && r.name === job.name);
      if (!exists) {
        await job.queue.add(job.name, job.data, { repeat: { pattern: job.pattern } });
      }
    }
  }

  private async getRepeatableJobs(queue: Queue) {
    try {
      return await queue.getRepeatableJobs();
    } catch {
      return [];
    }
  }
}
