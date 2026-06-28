import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { prisma } from '@nexora/database';

type JobType = 'AI_GENERATION' | 'EXPORT' | 'IMPORT' | 'NOTIFICATION' | 'BILLING' | 'CLEANUP' | 'REPORT' | 'SYNC' | 'WEBHOOK' | 'SEARCH_INDEX' | 'SEARCH_REINDEX';
type QueueName = 'ai-generation' | 'exports' | 'notifications' | 'billing' | 'cleanup' | 'reports' | 'search';

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue('ai-generation') private aiGenQueue: Queue,
    @InjectQueue('exports') private exportsQueue: Queue,
    @InjectQueue('notifications') private notificationsQueue: Queue,
    @InjectQueue('billing') private billingQueue: Queue,
    @InjectQueue('cleanup') private cleanupQueue: Queue,
    @InjectQueue('reports') private reportsQueue: Queue,
    @InjectQueue('search') private searchQueue: Queue,
  ) {}

  private getQueue(name: QueueName): Queue {
    const map: Record<QueueName, Queue> = {
      'ai-generation': this.aiGenQueue,
      exports: this.exportsQueue,
      notifications: this.notificationsQueue,
      billing: this.billingQueue,
      cleanup: this.cleanupQueue,
      reports: this.reportsQueue,
      search: this.searchQueue,
    };
    return map[name];
  }

  async enqueue(type: JobType, data: any, options?: { queueName?: QueueName; priority?: number; delay?: number; userId?: string; organizationId?: string }): Promise<any> {
    const queueName = options?.queueName || this.queueForType(type);
    const queue = this.getQueue(queueName);
    const bullJob = await queue.add(type, data, {
      priority: options?.priority ?? 0,
      delay: options?.delay,
      jobId: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    });
    return prisma.jobRecord.create({
      data: {
        type: type as any, status: options?.delay ? 'DELAYED' : 'QUEUED',
        priority: options?.priority ?? 0, data, queueName,
        bullJobId: bullJob.id ?? undefined,
        userId: options?.userId ?? undefined,
        organizationId: options?.organizationId ?? undefined,
        scheduledAt: options?.delay ? new Date(Date.now() + options.delay) : undefined,
        maxRetries: 3,
      },
    });
  }

  async getJob(id: string): Promise<any> {
    return prisma.jobRecord.findUnique({ where: { id } });
  }

  async listJobs(params: { type?: string; status?: string; limit?: number; offset?: number }): Promise<any> {
    const where: any = {};
    if (params.type) where.type = params.type;
    if (params.status) where.status = params.status;
    const [jobs, total] = await Promise.all([
      prisma.jobRecord.findMany({ where, orderBy: { createdAt: 'desc' }, take: params.limit || 50, skip: params.offset || 0 }),
      prisma.jobRecord.count({ where }),
    ]);
    return { jobs, total };
  }

  async cancelJob(id: string): Promise<any> {
    const record = await prisma.jobRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Job not found');
    if (record.bullJobId) {
      const queue = this.getQueue(record.queueName as QueueName);
      await queue.remove(record.bullJobId);
    }
    return prisma.jobRecord.update({ where: { id }, data: { status: 'CANCELED' } });
  }

  async retryJob(id: string): Promise<any> {
    const record = await prisma.jobRecord.findUnique({ where: { id } });
    if (!record) throw new Error('Job not found');
    const queue = this.getQueue(record.queueName as QueueName);
    const bullJob = await queue.add(record.type, record.data, {
      priority: record.priority,
      jobId: `${record.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    });
    return prisma.jobRecord.update({
      where: { id },
      data: { status: 'QUEUED', bullJobId: bullJob.id ?? undefined, retryCount: 0, error: null, startedAt: null, completedAt: null },
    });
  }

  async getQueueStats(): Promise<any> {
    const queues = ['ai-generation', 'exports', 'notifications', 'billing', 'cleanup', 'reports', 'search'] as const;
    const stats: any[] = [];
    for (const name of queues) {
      const queue = this.getQueue(name);
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
        queue.getDelayedCount(),
      ]);
      stats.push({ name, waiting, active, completed, failed, delayed });
    }
    return stats;
  }

  private queueForType(type: JobType): QueueName {
    const map: Record<JobType, QueueName> = {
      AI_GENERATION: 'ai-generation',
      EXPORT: 'exports',
      IMPORT: 'exports',
      NOTIFICATION: 'notifications',
      BILLING: 'billing',
      CLEANUP: 'cleanup',
      REPORT: 'reports',
      SYNC: 'exports',
      WEBHOOK: 'notifications',
      SEARCH_INDEX: 'search',
      SEARCH_REINDEX: 'search',
    };
    return map[type];
  }
}
