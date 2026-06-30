import { api } from './api';

export interface SafetyEvent {
  id: string;
  type: string;
  severity: string;
  input?: string;
  output?: string;
  category: string;
  detectedBy: string;
  action: string;
  modelId?: string;
  userId?: string;
  agentId?: string;
  createdAt: string;
}

export interface SafetyStats {
  total: number;
  blocked: number;
  flagged: number;
  byType: { type: string; _count: number }[];
  bySeverity: { severity: string; _count: number }[];
  byDetector: { detectedBy: string; _count: number }[];
}

export interface SafetyDashboard {
  total24h: number;
  critical24h: number;
  byCategory24h: { category: string; count: number }[];
  timeline24h: { hour: string; count: number }[];
}

export const safetyService = {
  getEvents: (params?: Record<string, string>) =>
    api.get<{ items: SafetyEvent[]; total: number }>(`/ai-safety/events${params ? '?' + new URLSearchParams(params).toString() : ''}`),

  getEvent: (id: string) =>
    api.get<SafetyEvent>(`/ai-safety/events/${id}`),

  getStats: (params?: Record<string, string>) =>
    api.get<SafetyStats>(`/ai-safety/stats${params ? '?' + new URLSearchParams(params).toString() : ''}`),

  getDashboard: () =>
    api.get<SafetyDashboard>('/ai-safety/dashboard'),

  getConfig: () =>
    api.get<any>('/ai-safety/config'),

  updateConfig: (config: any) =>
    api.put<any>('/ai-safety/config', config),

  getEventsByType: (params?: Record<string, string>) =>
    api.get<any[]>(`/ai-safety/events-by-type${params ? '?' + new URLSearchParams(params).toString() : ''}`),
};
