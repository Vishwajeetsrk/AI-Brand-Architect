import { api } from './api';

export interface Agent {
  id: string;
  name: string;
  description?: string;
  type: string;
  skills?: string[];
  userId: string;
  createdAt: string;
}

export interface AgentSkill {
  name: string;
  description: string;
}

export const agentService = {
  getAll: () => api.get<Agent[]>('/agents'),
  getById: (id: string) => api.get<Agent>(`/agents/${id}`),
  create: (data: { name: string; description?: string; type: string; skills?: string[] }) => api.post<Agent>('/agents', data),
  delete: (id: string) => api.delete<void>(`/agents/${id}`),
  getSkills: () => api.get<AgentSkill[]>('/agents/skills'),
  execute: (agentId: string, input: string, context?: { brandId?: string; projectId?: string }) =>
    api.post<{ output: string; plan: { goal: string; tasks: { description: string; status: string }[] }; duration: number; tokenUsage: { total: number } }>(
      '/agents/execute', { agentId, input, context }
    ),
};
