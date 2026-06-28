import { AiExecutionRecord, AiExecutionType, ExecutionLogger, MonitoringFilter, MonitoringStats } from './monitoring-types';

export class AiMonitoringService implements ExecutionLogger {
  private buffers: AiExecutionRecord[] = [];
  private flushIntervalMs: number;
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private persistCallback: ((records: AiExecutionRecord[]) => Promise<void>) | null = null;

  constructor(options?: { flushIntervalMs?: number }) {
    this.flushIntervalMs = options?.flushIntervalMs || 5000;
  }

  setPersistCallback(cb: (records: AiExecutionRecord[]) => Promise<void>): void {
    this.persistCallback = cb;
  }

  startAutoFlush(): void {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(() => {
      this.flush().catch(() => {});
    }, this.flushIntervalMs);
  }

  stopAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  async record(execution: AiExecutionRecord): Promise<void> {
    const record: AiExecutionRecord = {
      ...execution,
      id: execution.id || crypto.randomUUID(),
      createdAt: execution.createdAt || new Date(),
    };

    this.buffers.push(record);

    if (this.buffers.length >= 50) {
      await this.flush();
    }
  }

  async recordBatch(executions: AiExecutionRecord[]): Promise<void> {
    for (const exec of executions) {
      this.buffers.push({
        ...exec,
        id: exec.id || crypto.randomUUID(),
        createdAt: exec.createdAt || new Date(),
      });
    }

    if (this.buffers.length >= 50) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffers.length === 0) return;

    const batch = this.buffers.splice(0);
    if (this.persistCallback) {
      try {
        await this.persistCallback(batch);
      } catch (err) {
        this.buffers.unshift(...batch);
        throw err;
      }
    }
  }

  async getStats(filter?: MonitoringFilter): Promise<MonitoringStats> {
    return {
      totalExecutions: 0,
      totalTokens: 0,
      totalCost: 0,
      avgLatencyMs: 0,
      successRate: 0,
      topModels: [],
      costByProvider: [],
      latencyPercentiles: { p50: 0, p95: 0, p99: 0 },
      dailyUsage: [],
    };
  }

  createRecord(params: {
    type: AiExecutionType;
    provider: string;
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    cost?: number;
    latencyMs?: number;
    success?: boolean;
    errorMessage?: string;
    requestId?: string;
    agentId?: string;
    agentType?: string;
    metadata?: Record<string, unknown>;
    userId?: string;
  }): AiExecutionRecord {
    return {
      id: crypto.randomUUID(),
      type: params.type,
      provider: params.provider,
      model: params.model,
      promptTokens: params.promptTokens,
      completionTokens: params.completionTokens,
      totalTokens: params.totalTokens,
      cost: params.cost,
      latencyMs: params.latencyMs,
      success: params.success ?? true,
      errorMessage: params.errorMessage,
      requestId: params.requestId,
      agentId: params.agentId,
      agentType: params.agentType,
      metadata: params.metadata,
      userId: params.userId,
      createdAt: new Date(),
    };
  }
}
