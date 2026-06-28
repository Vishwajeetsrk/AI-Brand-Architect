import { Injectable } from '@nestjs/common';
import { prisma, NotificationChannel, NotificationStatus } from '@nexora/database';
import { sendEmail } from './providers/email.provider';
import { sendSlack } from './providers/slack.provider';
import { sendWebhook } from './providers/webhook.provider';

@Injectable()
export class NotificationsService {
  // ── In-App Notifications ──────────────────────────────────────────
  async getUserNotifications(userId: string, limit = 50, offset = 0, unreadOnly = false): Promise<any> {
    const where: any = { userId };
    if (unreadOnly) where.status = { not: 'READ' };
    const [items, total, unread] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, status: { not: 'READ' as any } } }),
    ]);
    return { items, total, unread };
  }

  async markAsRead(id: string): Promise<any> {
    return prisma.notification.update({ where: { id }, data: { status: 'READ', readAt: new Date() } });
  }

  async markAllAsRead(userId: string): Promise<any> {
    return prisma.notification.updateMany({ where: { userId, status: { not: 'READ' as any } }, data: { status: 'READ', readAt: new Date() } });
  }

  async deleteNotification(id: string): Promise<any> {
    return prisma.notification.delete({ where: { id } });
  }

  // ── Send Notification ────────────────────────────────────────────
  async send(params: {
    userId: string; channel: NotificationChannel; title: string; body: string;
    data?: any; referenceType?: string; referenceId?: string;
  }): Promise<any> {
    const allowed = await this.isChannelAllowed(params.userId, params.channel);
    if (!allowed) {
      return prisma.notification.create({ data: { ...params, status: 'CANCELED', data: params.data || undefined } });
    }
    const record = await prisma.notification.create({ data: { ...params, status: 'PENDING', data: params.data || undefined } });
    this.deliver(record.id, params.channel, params.userId, params.title, params.body, params.data).catch(() => {});
    return record;
  }

  async sendBulk(params: {
    userIds: string[]; channel: NotificationChannel; title: string; body: string;
    data?: any; referenceType?: string; referenceId?: string;
  }): Promise<any> {
    const results = [];
    for (const userId of params.userIds) {
      const r = await this.send({ ...params, userId });
      results.push(r);
    }
    return results;
  }

  private async deliver(id: string, channel: NotificationChannel, userId: string, title: string, body: string, data?: any) {
    let result: { sent: boolean; error?: string; messageId?: string };
    try {
      switch (channel) {
        case 'EMAIL': {
          const user = await prisma.user.findUnique({ where: { id: userId } });
          result = await sendEmail(user?.email || '', title, body);
          break;
        }
        case 'SLACK': {
          const webhookUrl = data?.webhookUrl || process.env.SLACK_WEBHOOK_URL;
          if (!webhookUrl) { result = { sent: false, error: 'No Slack webhook URL' }; break; }
          result = await sendSlack(webhookUrl, `${title}\n\n${body}`);
          break;
        }
        case 'WEBHOOK': {
          const url = data?.url;
          if (!url) { result = { sent: false, error: 'No webhook URL' }; break; }
          result = await sendWebhook(url, { title, body, data });
          break;
        }
        case 'IN_APP':
          result = { sent: true };
          break;
        default:
          result = { sent: true };
      }
    } catch (err: any) {
      result = { sent: false, error: err.message };
    }
    await prisma.notification.update({
      where: { id },
      data: {
        status: result.sent ? ('SENT' as any) : ('FAILED' as any),
        deliveredAt: result.sent ? new Date() : undefined,
        error: result.error || undefined,
      },
    });
  }

  // ── Preferences ───────────────────────────────────────────────────
  async getPreferences(userId: string) {
    const prefs = await prisma.notificationPreference.findMany({ where: { userId } });
    if (prefs.length === 0) {
      const defaults = ['EMAIL', 'PUSH', 'IN_APP', 'SLACK', 'WEBHOOK'] as NotificationChannel[];
      const created = await Promise.all(defaults.map(channel =>
        prisma.notificationPreference.create({ data: { userId, channel, types: ['*'] } })
      ));
      return created;
    }
    return prefs;
  }

  async updatePreference(userId: string, channel: NotificationChannel, data: { enabled?: boolean; types?: string[] }) {
    const pref = await prisma.notificationPreference.upsert({
      where: { userId_channel: { userId, channel } },
      create: { userId, channel, enabled: data.enabled ?? true, types: data.types ?? ['*'] },
      update: { ...(data.enabled !== undefined && { enabled: data.enabled }), ...(data.types && { types: data.types }) },
    });
    return pref;
  }

  private async isChannelAllowed(userId: string, channel: NotificationChannel): Promise<boolean> {
    const pref = await prisma.notificationPreference.findUnique({
      where: { userId_channel: { userId, channel } },
    });
    return pref ? pref.enabled : true;
  }

  // ── Templates ─────────────────────────────────────────────────────
  async getTemplates(channel?: NotificationChannel): Promise<any> {
    const where = channel ? { channel } : {};
    return prisma.notificationTemplate.findMany({ where, orderBy: { name: 'asc' } });
  }

  async createTemplate(data: { name: string; channel: NotificationChannel; subject?: string; body: string; variables?: string[] }): Promise<any> {
    return prisma.notificationTemplate.create({
      data: { name: data.name, channel: data.channel, subject: data.subject, body: data.body, variables: data.variables || [] },
    });
  }

  async renderTemplate(name: string, vars: Record<string, string>): Promise<{ subject?: string; body: string } | null> {
    const tpl = await prisma.notificationTemplate.findUnique({ where: { name } });
    if (!tpl) return null;
    const render = (text: string) => text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`);
    return { subject: tpl.subject ? render(tpl.subject) : undefined, body: render(tpl.body) };
  }

  // ── Stats ─────────────────────────────────────────────────────────
  async getStats(userId?: string): Promise<any> {
    const where = userId ? { userId } : {};
    const [total, sent, failed, read] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { ...where, status: 'SENT' as any } }),
      prisma.notification.count({ where: { ...where, status: 'FAILED' as any } }),
      prisma.notification.count({ where: { ...where, status: 'READ' as any } }),
    ]);
    return { total, sent, failed, read };
  }
}
