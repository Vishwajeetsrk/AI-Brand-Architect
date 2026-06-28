import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { prisma } from '@nexora/database';
import { SearchEngine, SearchDocumentType } from '@nexora/search';
import { sendEmail } from '../notifications/providers/email.provider';
import { sendSlack } from '../notifications/providers/slack.provider';
import { sendWebhook } from '../notifications/providers/webhook.provider';

@Processor('ai-generation', { concurrency: 5 })
@Processor('exports', { concurrency: 3 })
@Processor('notifications', { concurrency: 10 })
@Processor('billing', { concurrency: 2 })
@Processor('cleanup', { concurrency: 1 })
@Processor('reports', { concurrency: 2 })
@Processor('search', { concurrency: 2 })
export class JobConsumer extends WorkerHost {
  async process(job: Job): Promise<any> {
    const queueName = job.queueName;
    const record = await prisma.jobRecord.findFirst({
      where: { bullJobId: job.id, queueName },
      orderBy: { createdAt: 'desc' },
    });
    if (record) {
      await prisma.jobRecord.update({ where: { id: record.id }, data: { status: 'ACTIVE', startedAt: new Date() } });
    }
    try {
      const result = await this.handleJob(job);
      if (record) {
        await prisma.jobRecord.update({ where: { id: record.id }, data: { status: 'COMPLETED', result, completedAt: new Date() } });
      }
      return result;
    } catch (error: any) {
      if (record) {
        const retryCount = (record.retryCount || 0) + 1;
        const status = retryCount >= record.maxRetries ? 'FAILED' : 'QUEUED';
        await prisma.jobRecord.update({
          where: { id: record.id },
          data: { status, error: error.message, retryCount },
        });
      }
      throw error;
    }
  }

  private async handleJob(job: Job): Promise<any> {
    const { name: type, data } = job;
    switch (type) {
      case 'AI_GENERATION':
        return this.handleAiGeneration(data);
      case 'EXPORT':
        return this.handleExport(data);
      case 'IMPORT':
        return this.handleImport(data);
      case 'NOTIFICATION':
        return this.handleNotification(data);
      case 'BILLING':
        return this.handleBilling(data);
      case 'CLEANUP':
        return this.handleCleanup(data);
      case 'REPORT':
        return this.handleReport(data);
      case 'SYNC':
        return this.handleSync(data);
      case 'WEBHOOK':
        return this.handleWebhook(data);
      case 'SEARCH_INDEX':
        return this.handleSearchIndex(data);
      case 'SEARCH_REINDEX':
        return this.handleSearchReindex(data);
      default:
        throw new Error(`Unknown job type: ${type}`);
    }
  }

  private async handleAiGeneration(data: any) {
    const { prompt, model, userId, projectId } = data;
    return { generated: true, prompt, model, userId, projectId };
  }

  private async handleExport(data: any) {
    const { type: exportType, resourceId, format, userId } = data;
    if (exportType === 'project') {
      const prj = await prisma.project.findUnique({ where: { id: resourceId } });
      return { exported: true, name: prj?.name, format, userId };
    }
    return { exported: true, resourceId, format };
  }

  private async handleImport(data: any) {
    const { source, type, userId } = data;
    return { imported: true, source, type, userId };
  }

  private async handleNotification(data: any) {
    const { channel, userId, to, subject, body, title } = data;
    const recipientUserId = userId;
    let result: { sent: boolean; error?: string };
    switch (channel) {
      case 'EMAIL': {
        const email = to || (recipientUserId ? (await prisma.user.findUnique({ where: { id: recipientUserId } }))?.email : undefined);
        if (!email) return { sent: false, error: 'No recipient email' };
        result = await sendEmail(email, subject || title || 'Notification', body);
        break;
      }
      case 'SLACK': {
        const webhookUrl = data?.webhookUrl || process.env.SLACK_WEBHOOK_URL;
        if (!webhookUrl) return { sent: false, error: 'No Slack webhook URL' };
        result = await sendSlack(webhookUrl, `${title || subject}\n\n${body}`);
        break;
      }
      case 'WEBHOOK': {
        const url = data?.url;
        if (!url) return { sent: false, error: 'No webhook URL' };
        result = await sendWebhook(url, { title, body, data });
        break;
      }
      default:
        result = { sent: true };
    }
    if (recipientUserId) {
      await prisma.notification.create({
        data: {
          userId: recipientUserId, channel: channel || 'IN_APP',
          title: title || subject || 'Notification', body,
          status: result.sent ? 'SENT' : 'FAILED',
          error: result.error || undefined,
        },
      });
    }
    return result;
  }

  private async handleBilling(data: any) {
    const { action, organizationId, userId } = data;
    if (action === 'generate-invoices') {
      const subs = await prisma.subscription.findMany({
        where: { status: 'ACTIVE', currentPeriodEnd: { lte: new Date() } },
        include: { plan: true, organization: true },
      });
      for (const sub of subs) {
        await prisma.invoice.create({
          data: {
            subscriptionId: sub.id,
            organizationId: sub.organizationId,
            invoiceNumber: `INV-AUTO-${Date.now()}-${sub.id.slice(0, 8)}`,
            status: 'PENDING',
            subtotal: sub.plan.price,
            discountAmount: 0,
            taxAmount: 0,
            total: sub.plan.price,
            currency: 'INR',
            dueDate: new Date(Date.now() + 30 * 86400000),
            lineItems: { create: [{ description: `${sub.plan.name} - Renewal`, quantity: 1, unitPrice: sub.plan.price, amount: sub.plan.price, type: 'SUBSCRIPTION' }] },
          },
        });
      }
      return { invoicesGenerated: subs.length };
    }
    if (action === 'payment-reminder') {
      const overdue = await prisma.invoice.findMany({ where: { status: 'PENDING', dueDate: { lte: new Date() } } });
      return { remindersSent: overdue.length };
    }
    return { action };
  }

  private async handleCleanup(data: any) {
    const { target, olderThanDays } = data;
    const cutoff = new Date(Date.now() - (olderThanDays || 90) * 86400000);
    if (target === 'audit-logs') {
      const deleted = await prisma.auditLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
      return { deleted: deleted.count, target };
    }
    if (target === 'sessions') {
      const deleted = await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
      return { deleted: deleted.count, target };
    }
    if (target === 'job-records') {
      const deleted = await prisma.jobRecord.deleteMany({ where: { createdAt: { lt: cutoff }, status: { in: ['COMPLETED', 'FAILED', 'CANCELED'] } } });
      return { deleted: deleted.count, target };
    }
    return { target, olderThanDays };
  }

  private async handleReport(data: any) {
    const { type, organizationId, period } = data;
    return { report: type, organizationId, period, generatedAt: new Date().toISOString() };
  }

  private async handleSync(data: any) {
    const { provider, action, resource } = data;
    return { synced: true, provider, action, resource };
  }

  private async handleWebhook(data: any) {
    const { url, payload, method } = data;
    return { webhook: true, url, method, sentAt: new Date().toISOString() };
  }

  private async handleSearchIndex(data: any) {
    const { entityType, entityId, title, description, content, tags, userId, organizationId } = data;
    const engine = new SearchEngine();
    await engine.indexDocument({
      entityType: entityType as SearchDocumentType,
      entityId,
      title,
      description,
      content,
      tags,
      userId,
      organizationId,
    });
    return { indexed: true, entityType, entityId };
  }

  private async handleSearchReindex(data: any) {
    const { entityType } = data;
    const engine = new SearchEngine();
    const indexer = engine["indexer"];
    await indexer.clear(entityType ? entityType as SearchDocumentType : undefined);

    let count = 0;
    if (!entityType || entityType === 'BRAND') {
      const brands = await prisma.brand.findMany();
      for (const b of brands) {
        await engine.indexDocument({ entityType: 'BRAND' as SearchDocumentType, entityId: b.id, title: b.name, description: (b as any).description, userId: b.userId, organizationId: (b as any).organizationId });
        count++;
      }
    }
    if (!entityType || entityType === 'PROJECT') {
      const projects = await prisma.project.findMany();
      for (const p of projects) {
        await engine.indexDocument({ entityType: 'PROJECT' as SearchDocumentType, entityId: p.id, title: p.name, description: (p as any).description, userId: p.userId, organizationId: (p as any).organizationId });
        count++;
      }
    }
    if (!entityType || entityType === 'KNOWLEDGE') {
      const docs = await prisma.knowledgeDocument.findMany();
      for (const d of docs) {
        await engine.indexDocument({ entityType: 'KNOWLEDGE' as SearchDocumentType, entityId: d.id, title: d.title, content: d.content ?? undefined, userId: (d.metadata as any)?.authorId, organizationId: (d as any).organizationId });
        count++;
      }
    }
    if (!entityType || entityType === 'USER') {
      const users = await prisma.user.findMany();
      for (const u of users) {
        await engine.indexDocument({ entityType: 'USER' as SearchDocumentType, entityId: u.id, title: u.name || u.email, description: u.email, userId: u.id, organizationId: (u as any).organizationId });
        count++;
      }
    }

    return { reindexed: true, count, entityType: entityType || 'all' };
  }
}
