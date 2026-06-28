import { api } from './api';

export interface MonitoringStats {
  totalExecutions: number;
  failedExecutions: number;
  successRate: number;
  totalTokens: number;
  totalCost: number;
  avgLatencyMs: number;
  topModels: { model: string; executions: number; cost: number }[];
  latencyPercentiles: { p50: number; p95: number; p99: number };
  dailyUsage: { date: string; tokens: number; cost: number; executions: number }[];
}

export interface ExecutionLog {
  id: string;
  type: string;
  provider: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  cost?: number;
  latencyMs?: number;
  success: boolean;
  errorMessage?: string;
  userId?: string;
  createdAt: string;
}

export interface CostBreakdown {
  byModel: { model: string; cost: number }[];
  byProvider: { provider: string; cost: number }[];
  byDay: { date: string; cost: number }[];
}

export interface ModelQuality {
  model: string;
  provider: string;
  executions: number;
  successRate: number;
  avgLatencyMs: number;
  avgTokens: number;
  totalCost: number;
}

export interface RealtimeMetrics {
  executionsLastMinute: number;
  executionsLastHour: number;
  tokensLastHour: number;
  costLastHour: number;
  errorsLastHour: number;
  avgLatencyMsLastHour: number;
  recordedAt: string;
}

export interface ErrorAnalytics {
  totalFailed: number;
  byModel: { model: string; errors: number }[];
  byProvider: { provider: string; errors: number }[];
  hourlyErrors: { hour: string; errors: number }[];
}

export const monitoringService = {
  getStats: (params?: Record<string, string>) =>
    api.get<MonitoringStats>(`/ai-monitoring/stats${params ? '?' + new URLSearchParams(params).toString() : ''}`),

  getExecutions: (params?: Record<string, string>) =>
    api.get<{ items: ExecutionLog[]; total: number }>(`/ai-monitoring/executions${params ? '?' + new URLSearchParams(params).toString() : ''}`),

  getCostByProvider: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return api.get<any[]>(`/ai-monitoring/cost-by-provider?${params.toString()}`);
  },

  getModelQuality: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return api.get<ModelQuality[]>(`/ai-monitoring/model-quality?${params.toString()}`);
  },

  getRealtime: () =>
    api.get<RealtimeMetrics>('/ai-monitoring/realtime'),

  getCostBreakdown: (userId?: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (userId) params.set('userId', userId);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return api.get<CostBreakdown>(`/ai-monitoring/cost-breakdown?${params.toString()}`);
  },

  getErrorAnalytics: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return api.get<ErrorAnalytics>(`/ai-monitoring/error-analytics?${params.toString()}`);
  },
};
