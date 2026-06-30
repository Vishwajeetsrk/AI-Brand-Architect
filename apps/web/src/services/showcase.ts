import { api } from './api';

export interface ShowcaseProject {
  id: string; userId: string; title: string; description?: string;
  projectUrl?: string; imageUrl?: string; tags: string[];
  likes: number; comments: Comment[]; isPublic: boolean; createdAt: string;
}

export interface Comment {
  id: string; userId: string; content: string; createdAt: string;
}

export const showcaseService = {
  list: () => api.get<ShowcaseProject[]>('/showcase'),
  mine: () => api.get<ShowcaseProject[]>('/showcase/mine'),
  get: (id: string) => api.get<ShowcaseProject>(`/showcase/${id}`),
  create: (d: any) => api.post<ShowcaseProject>('/showcase', d),
  like: (id: string) => api.post<ShowcaseProject>(`/showcase/${id}/like`),
  addComment: (id: string, content: string) => api.post<ShowcaseProject>(`/showcase/${id}/comments`, { content }),
};
