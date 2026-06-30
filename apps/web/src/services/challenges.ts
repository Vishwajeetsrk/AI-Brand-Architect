import { api } from './api';

export interface Challenge {
  id: string; title: string; description: string; language: string;
  difficulty: string; topics: string[]; starterCode?: string;
  testCases: { input: string; expected: string }[]; createdAt: string;
}

export interface Submission {
  id: string; challengeId: string; code: string; language: string;
  passed: boolean; score: number; output: string; submittedAt: string;
}

export const challengesService = {
  list: (params?: Record<string, string>) => api.get<Challenge[]>(`/challenges${params ? '?' + new URLSearchParams(params).toString() : ''}`),
  get: (id: string) => api.get<Challenge>(`/challenges/${id}`),
  create: (d: any) => api.post<Challenge>('/challenges', d),
  submit: (d: { challengeId: string; code: string; language: string }) => api.post<Submission>('/challenges/submit', d),
  submissions: () => api.get<Submission[]>('/challenges/submissions/mine'),
};
