import { api } from './api';

export const mediaService = {
  thumbnails: {
    generate: (d: any) => api.post<any>('/media/thumbnails/generate', d),
    list: () => api.get<any[]>('/media/thumbnails'),
  },
  code: {
    execute: (d: { language: string; code: string; input?: string }) => api.post<any>('/media/code/execute', d),
    list: () => api.get<any[]>('/media/code/executions'),
  },
};
