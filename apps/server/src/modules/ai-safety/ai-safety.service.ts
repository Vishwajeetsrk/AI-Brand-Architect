import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { SafetyQueryDto, SafetyConfigDto } from './dto/ai-safety.dto';

@Injectable()
export class AISafetyService {
  private readonly logger = new Logger(AISafetyService.name);
  private config: { enabled: boolean; mode: 'strict' | 'moderate' | 'relaxed' } = {
    enabled: true,
    mode: 'moderate',
  };

  async getEvents(query: SafetyQueryDto): Promise<any> {
    const where: any = {};
    if (query.type) where.type = query.type;
    if (query.severity) where.severity = query.severity;
    if (query.category) where.category = query.category;
    if (query.userId) where.userId = query.userId;
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [items, total] = await Promise.all([
      prisma.aISafetyEvent.findMany({
        where, orderBy: { createdAt: 'desc' },
        take: parseInt(query.limit || '50'),
        skip: parseInt(query.offset || '0'),
      }),
      prisma.aISafetyEvent.count({ where }),
    ]);
    return { items, total };
  }

  async getStats(query: SafetyQueryDto) {
    const where: any = {};
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [total, blocked, flagged, byType, bySeverity, byDetector] = await Promise.all([
      prisma.aISafetyEvent.count({ where }),
      prisma.aISafetyEvent.count({ where: { ...where, action: 'block' } }),
      prisma.aISafetyEvent.count({ where: { ...where, action: 'flag' } }),
      prisma.aISafetyEvent.groupBy({ by: ['type'], where, _count: true, orderBy: { _count: { type: 'desc' } } }),
      prisma.aISafetyEvent.groupBy({ by: ['severity'], where, _count: true, orderBy: { _count: { severity: 'desc' } } }),
      prisma.aISafetyEvent.groupBy({ by: ['detectedBy'], where, _count: true, orderBy: { _count: { detectedBy: 'desc' } } }),
    ]);

    return { total, blocked, flagged, byType, bySeverity, byDetector };
  }

  async getEvent(id: string): Promise<any> {
    return prisma.aISafetyEvent.findUnique({ where: { id } });
  }

  async getDashboard() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [total24h, critical24h, byCategory24h, timeline24h] = await Promise.all([
      prisma.aISafetyEvent.count({ where: { createdAt: { gte: last24h } } }),
      prisma.aISafetyEvent.count({ where: { createdAt: { gte: last24h }, severity: { in: ['high', 'critical'] } } }),
      prisma.aISafetyEvent.groupBy({ by: ['category'], where: { createdAt: { gte: last24h } }, _count: true, orderBy: { _count: { category: 'desc' } } }),
      prisma.$queryRawUnsafe<Array<{ hour: Date; count: bigint }>>(
        `SELECT DATE_TRUNC('hour', created_at) as hour, COUNT(*) as count FROM ai_safety_events WHERE created_at >= $1 GROUP BY hour ORDER BY hour`,
        last24h,
      ),
    ]);

    return {
      total24h, critical24h,
      byCategory24h: byCategory24h.map(c => ({ category: c.category, count: c._count })),
      timeline24h: timeline24h.map(t => ({ hour: t.hour, count: Number(t.count) })),
    };
  }

  async getSafetyConfig() {
    return this.config;
  }

  async updateSafetyConfig(dto: SafetyConfigDto) {
    if (dto.enabled !== undefined) this.config.enabled = dto.enabled;
    if (dto.mode) this.config.mode = dto.mode;
    return this.config;
  }

  async getEventsByType(query: SafetyQueryDto) {
    const where: any = {};
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }
    return prisma.aISafetyEvent.groupBy({ by: ['type', 'category'], where, _count: true, orderBy: { _count: { type: 'desc' } } });
  }
}
