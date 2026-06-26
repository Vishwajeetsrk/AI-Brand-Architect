import { api } from './api';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: string;
  createdAt: string;
}

export const organizationService = {
  getAll: () => api.get<Organization[]>('/organizations'),
  getById: (id: string) => api.get<Organization>(`/organizations/${id}`),
  create: (data: { name: string; slug: string }) => api.post<Organization>('/organizations', data),
  update: (id: string, data: Partial<Organization>) => api.patch<Organization>(`/organizations/${id}`, data),
  inviteMember: (orgId: string, email: string, role: string) => api.post(`/organizations/${orgId}/invite`, { email, role }),
  getMembers: (orgId: string) => api.get<{ id: string; userId: string; role: string; user: { email: string; name: string } }[]>(`/organizations/${orgId}/members`),
};
