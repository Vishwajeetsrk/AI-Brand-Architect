import { api } from './api';

export const coachingService = {
  sessions: {
    list: () => api.get<any[]>('/coaching/sessions'),
    get: (id: string) => api.get<any>(`/coaching/sessions/${id}`),
    create: (d: any) => api.post<any>('/coaching/sessions', d),
    updateStatus: (id: string, status: string) => api.put<any>(`/coaching/sessions/${id}/status`, { status }),
    addFeedback: (id: string, feedback: string, rating: number) => api.post<any>(`/coaching/sessions/${id}/feedback`, { feedback, rating }),
  },
};
