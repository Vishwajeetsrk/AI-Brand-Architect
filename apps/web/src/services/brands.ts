import { api } from './api';

export interface Brand {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  logo?: string;
  tagline?: string;
  voice?: string;
  targetAudience?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandDto {
  name: string;
  description?: string;
  industry?: string;
  voice?: string;
  targetAudience?: string;
}

export const brandService = {
  getAll: () => api.get<Brand[]>('/brands'),
  getById: (id: string) => api.get<Brand>(`/brands/${id}`),
  create: (data: CreateBrandDto) => api.post<Brand>('/brands', data),
  update: (id: string, data: Partial<CreateBrandDto>) => api.patch<Brand>(`/brands/${id}`, data),
  delete: (id: string) => api.delete<void>(`/brands/${id}`),
  search: (query: string) => api.get<Brand[]>(`/brands?search=${encodeURIComponent(query)}`),
};
