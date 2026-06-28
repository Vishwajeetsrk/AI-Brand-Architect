export type AiExecutionType = 'completion' | 'chat' | 'embedding' | 'agent_execution' | 'tool_call';

export interface AiExecutionRecord {
  id?: string;
  type: AiExecutionType;
  provider: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  cost?: number;
  latencyMs?: number;
  success: boolean;
  errorMessage?: string;
  requestId?: string;
  agentId?: string;
  agentType?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  organizationId?: string;
  createdAt?: Date;
}

export interface MonitoringStats {
  totalExecutions: number;
  totalTokens: number;
  totalCost: number;
  avgLatencyMs: number;
  successRate: number;
  topModels: { model: string; count: number; cost: number }[];
  costByProvider: { provider: string; cost: number }[];
  latencyPercentiles: { p50: number; p95: number; p99: number };
  dailyUsage: { date: string; tokens: number; cost: number; executions: number }[];
}

export interface MonitoringFilter {
  userId?: string;
  organizationId?: string;
  provider?: string;
  model?: string;
  agentId?: string;
  success?: boolean;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface ExecutionLogger {
  record(execution: AiExecutionRecord): Promise<void>;
  recordBatch(executions: AiExecutionRecord[]): Promise<void>;
}
