import { api } from './api';

export interface Asset {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  mimeType?: string;
  projectId?: string;
  userId: string;
  createdAt: string;
}

export const assetService = {
  getAll: (projectId?: string) => api.get<Asset[]>(`/assets${projectId ? `?projectId=${projectId}` : ''}`),
  create: (data: FormData) => {
    const token = localStorage.getItem('nexora_token');
    return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/assets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    }).then(r => r.json());
  },
  delete: (id: string) => api.delete<void>(`/assets/${id}`),
};
