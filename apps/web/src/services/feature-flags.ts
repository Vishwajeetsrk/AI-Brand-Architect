import { api } from './api';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  rules?: any;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const featureFlagsService = {
  list: (tag?: string) =>
    api.get<FeatureFlag[]>(`/feature-flags${tag ? `?tag=${tag}` : ''}`),

  get: (id: string) =>
    api.get<FeatureFlag>(`/feature-flags/${id}`),

  getByKey: (key: string) =>
    api.get<FeatureFlag>(`/feature-flags/by-key/${key}`),

  evaluate: (key: string, context?: { userId?: string; groups?: string[]; environment?: string }) => {
    const params = new URLSearchParams();
    if (context?.userId) params.set('userId', context.userId);
    if (context?.groups?.length) params.set('groups', context.groups.join(','));
    if (context?.environment) params.set('environment', context.environment);
    return api.get<{ key: string; enabled: boolean }>(`/feature-flags/${key}/evaluate?${params.toString()}`);
  },

  evaluateAll: (context?: { userId?: string; groups?: string[]; environment?: string }) => {
    const params = new URLSearchParams();
    if (context?.userId) params.set('userId', context.userId);
    if (context?.groups?.length) params.set('groups', context.groups.join(','));
    if (context?.environment) params.set('environment', context.environment);
    return api.get<Record<string, boolean>>(`/feature-flags/evaluate-all?${params.toString()}`);
  },

  create: (data: { key: string; name: string; description?: string; enabled?: boolean; rules?: any; tags?: string[] }) =>
    api.post<FeatureFlag>('/feature-flags', data),

  update: (id: string, data: { name?: string; description?: string; enabled?: boolean; rules?: any; tags?: string[] }) =>
    api.put<FeatureFlag>(`/feature-flags/${id}`, data),

  toggle: (id: string) =>
    api.put<FeatureFlag>(`/feature-flags/${id}/toggle`),

  remove: (id: string) =>
    api.delete<void>(`/feature-flags/${id}`),
};
