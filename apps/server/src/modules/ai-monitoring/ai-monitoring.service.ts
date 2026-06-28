import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@nexora/database';

@Injectable()
export class AiMonitoringService {
  private readonly logger = new Logger(AiMonitoringService.name);

  async getStats(params: {
    userId?: string;
    provider?: string;
    model?: string;
    agentId?: string;
    success?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.provider) where.provider = params.provider;
    if (params.model) where.model = params.model;
    if (params.agentId) where.agentId = params.agentId;
    if (params.success !== undefined) where.success = params.success === 'true';
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const [total, failed, agg, topModelsRaw, latencyRaw, dailyRaw] = await Promise.all([
      prisma.aiExecutionLog.count({ where }),
      prisma.aiExecutionLog.count({ where: { ...where, success: false } }),
      prisma.aiExecutionLog.aggregate({
        where,
        _sum: { totalTokens: true, cost: true, latencyMs: true },
        _avg: { latencyMs: true },
      }),
      prisma.aiExecutionLog.groupBy({
        by: ['model'],
        where,
        _count: { id: true },
        _sum: { cost: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      prisma.$queryRawUnsafe<Array<{ percentile: number; value: number }>>(
        `SELECT percentile, value FROM (
          SELECT 50 AS percentile, PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY latency_ms) AS value FROM ai_execution_logs WHERE ${this.buildWhereClause(params)}
          UNION ALL SELECT 95, PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) FROM ai_execution_logs WHERE ${this.buildWhereClause(params)}
          UNION ALL SELECT 99, PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY latency_ms) FROM ai_execution_logs WHERE ${this.buildWhereClause(params)}
        ) AS latencies`,
      ),
      prisma.$queryRawUnsafe<Array<{ date: string; tokens: bigint; cost: number; executions: bigint }>>(
        `SELECT DATE(created_at) AS date,
                COALESCE(SUM(total_tokens), 0) AS tokens,
                COALESCE(SUM(cost), 0) AS cost,
                COUNT(*) AS executions
         FROM ai_execution_logs
         WHERE ${this.buildWhereClause(params)}
         GROUP BY DATE(created_at)
         ORDER BY date ASC
         LIMIT 90`,
      ),
    ]);

    const successRate = total > 0 ? ((total - failed) / total) * 100 : 100;

    return {
      totalExecutions: total,
      failedExecutions: failed,
      successRate: Number(successRate.toFixed(1)),
      totalTokens: agg._sum.totalTokens || 0,
      totalCost: Number((agg._sum.cost || 0).toFixed(6)),
      avgLatencyMs: Number((agg._avg.latencyMs || 0).toFixed(1)),
      topModels: topModelsRaw.map(m => ({
        model: m.model,
        executions: m._count.id,
        cost: Number((m._sum.cost || 0).toFixed(6)),
      })),
      latencyPercentiles: {
        p50: Number((latencyRaw.find((l: any) => l.percentile === 50)?.value || 0).toFixed(1)),
        p95: Number((latencyRaw.find((l: any) => l.percentile === 95)?.value || 0).toFixed(1)),
        p99: Number((latencyRaw.find((l: any) => l.percentile === 99)?.value || 0).toFixed(1)),
      },
      dailyUsage: (dailyRaw as any[]).map(d => ({
        date: d.date instanceof Date ? d.date.toISOString().split('T')[0] : String(d.date),
        tokens: Number(d.tokens),
        cost: Number(Number(d.cost).toFixed(6)),
        executions: Number(d.executions),
      })),
    };
  }

  async getExecutions(params: {
    userId?: string;
    provider?: string;
    model?: string;
    agentId?: string;
    success?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: any[]; total: number }> {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.provider) where.provider = params.provider;
    if (params.model) where.model = params.model;
    if (params.agentId) where.agentId = params.agentId;
    if (params.success !== undefined) where.success = params.success === 'true';
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const [items, total] = await Promise.all([
      prisma.aiExecutionLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: params.limit || 50,
        skip: params.offset || 0,
      }),
      prisma.aiExecutionLog.count({ where }),
    ]);

    return { items, total };
  }

  async getCostByProvider(params: { startDate?: string; endDate?: string }): Promise<any[]> {
    const where: any = {};
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const result = await prisma.aiExecutionLog.groupBy({
      by: ['provider'],
      where,
      _sum: { cost: true },
      _count: { id: true },
      orderBy: { _sum: { cost: 'desc' } },
    });

    return result.map(r => ({
      provider: r.provider,
      cost: Number((r._sum.cost || 0).toFixed(6)),
      executions: r._count.id,
    }));
  }

  async getModelQuality(params: { startDate?: string; endDate?: string }): Promise<any[]> {
    const where: any = {};
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const result = await prisma.aiExecutionLog.groupBy({
      by: ['model', 'provider'],
      where,
      _count: { id: true, success: true },
      _avg: { latencyMs: true, totalTokens: true },
      _sum: { cost: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return result.map(r => ({
      model: r.model,
      provider: r.provider,
      executions: r._count.id,
      successCount: r._count.success,
      successRate: r._count.id > 0 ? Number(((r._count.success / r._count.id) * 100).toFixed(1)) : 0,
      avgLatencyMs: Number((r._avg.latencyMs || 0).toFixed(1)),
      avgTokens: Number((r._avg.totalTokens || 0).toFixed(0)),
      totalCost: Number((r._sum.cost || 0).toFixed(6)),
    }));
  }

  async getRealtimeMetrics(): Promise<any> {
    const lastMinute = new Date(Date.now() - 60000);
    const lastHour = new Date(Date.now() - 3600000);

    const [lastMinCount, lastHourCount, lastHourTokens, lastHourCost, lastHourErrors, lastHourLatency] = await Promise.all([
      prisma.aiExecutionLog.count({ where: { createdAt: { gte: lastMinute } } }),
      prisma.aiExecutionLog.count({ where: { createdAt: { gte: lastHour } } }),
      prisma.aiExecutionLog.aggregate({
        where: { createdAt: { gte: lastHour } },
        _sum: { totalTokens: true },
      }),
      prisma.aiExecutionLog.aggregate({
        where: { createdAt: { gte: lastHour } },
        _sum: { cost: true },
      }),
      prisma.aiExecutionLog.count({ where: { createdAt: { gte: lastHour }, success: false } }),
      prisma.aiExecutionLog.aggregate({
        where: { createdAt: { gte: lastHour } },
        _avg: { latencyMs: true },
      }),
    ]);

    return {
      executionsLastMinute: lastMinCount,
      executionsLastHour: lastHourCount,
      tokensLastHour: lastHourTokens._sum.totalTokens || 0,
      costLastHour: Number((lastHourCost._sum.cost || 0).toFixed(6)),
      errorsLastHour: lastHourErrors,
      avgLatencyMsLastHour: Number((lastHourLatency._avg.latencyMs || 0).toFixed(1)),
      recordedAt: new Date().toISOString(),
    };
  }

  async getCostBreakdown(params: { userId?: string; startDate?: string; endDate?: string }): Promise<any> {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const [byModel, byProvider, byDay] = await Promise.all([
      prisma.aiExecutionLog.groupBy({
        by: ['model'],
        where,
        _sum: { cost: true },
        orderBy: { _sum: { cost: 'desc' } },
        take: 10,
      }),
      prisma.aiExecutionLog.groupBy({
        by: ['provider'],
        where,
        _sum: { cost: true },
        orderBy: { _sum: { cost: 'desc' } },
      }),
      prisma.$queryRawUnsafe<Array<{ date: string; cost: number }>>(
        `SELECT DATE(created_at) AS date, COALESCE(SUM(cost), 0) AS cost
         FROM ai_execution_logs
         WHERE ${this.buildWhereClause(params as any)}
         GROUP BY DATE(created_at)
         ORDER BY date ASC
         LIMIT 90`,
      ),
    ]);

    return {
      byModel: byModel.map(m => ({ model: m.model, cost: Number((m._sum.cost || 0).toFixed(6)) })),
      byProvider: byProvider.map(p => ({ provider: p.provider, cost: Number((p._sum.cost || 0).toFixed(6)) })),
      byDay: (byDay as any[]).map(d => ({
        date: d.date instanceof Date ? d.date.toISOString().split('T')[0] : String(d.date),
        cost: Number(Number(d.cost).toFixed(6)),
      })),
    };
  }

  async getErrorAnalytics(params: { startDate?: string; endDate?: string }): Promise<any> {
    const where: any = { success: false };
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const [byModel, byProvider, hourlyErrors, totalFailed] = await Promise.all([
      prisma.aiExecutionLog.groupBy({
        by: ['model'],
        where,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      prisma.aiExecutionLog.groupBy({
        by: ['provider'],
        where,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.$queryRawUnsafe<Array<{ hour: string; errors: bigint }>>(
        `SELECT DATE_TRUNC('hour', created_at) AS hour, COUNT(*) AS errors
         FROM ai_execution_logs
         WHERE success = false ${params.startDate ? `AND created_at >= '${params.startDate}'` : ''}
         GROUP BY DATE_TRUNC('hour', created_at)
         ORDER BY hour ASC
         LIMIT 168`,
      ),
      prisma.aiExecutionLog.count({ where }),
    ]);

    return {
      totalFailed,
      byModel: byModel.map(m => ({ model: m.model, errors: m._count.id })),
      byProvider: byProvider.map(p => ({ provider: p.provider, errors: p._count.id })),
      hourlyErrors: (hourlyErrors as any[]).map(h => ({
        hour: h.hour instanceof Date ? h.hour.toISOString() : String(h.hour),
        errors: Number(h.errors),
      })),
    };
  }

  private buildWhereClause(params: {
    userId?: string;
    provider?: string;
    model?: string;
    agentId?: string;
    success?: string;
    startDate?: string;
    endDate?: string;
  }): string {
    const conditions: string[] = ['1=1'];
    if (params.userId) conditions.push(`user_id = '${params.userId}'`);
    if (params.provider) conditions.push(`provider = '${params.provider}'`);
    if (params.model) conditions.push(`model = '${params.model}'`);
    if (params.agentId) conditions.push(`agent_id = '${params.agentId}'`);
    if (params.success !== undefined) conditions.push(`success = ${params.success === 'true'}`);
    if (params.startDate) conditions.push(`created_at >= '${params.startDate}'`);
    if (params.endDate) conditions.push(`created_at <= '${params.endDate}'`);
    return conditions.join(' AND ');
  }
}
