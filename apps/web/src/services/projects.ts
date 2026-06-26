import { api } from './api';

export interface Project {
  id: string;
  name: string;
  description?: string;
  brandId: string;
  userId: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export const projectService = {
  getAll: (brandId?: string) => api.get<Project[]>(`/projects${brandId ? `?brandId=${brandId}` : ''}`),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: { name: string; description?: string; brandId: string }) => api.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.patch<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete<void>(`/projects/${id}`),
};
