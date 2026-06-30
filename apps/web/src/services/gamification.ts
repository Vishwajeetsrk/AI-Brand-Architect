import { api } from './api';

export interface LeaderboardEntry {
  userId: string; userName: string; points: number; level: string;
  achievements: string[]; rank: number;
}

export interface UserGamificationStats {
  points: number; level: string;
  achievements: { id: string; name: string; description: string; icon: string }[];
  history: { points: number; reason: string; date: string }[];
}

export const gamificationService = {
  leaderboard: {
    get: (limit?: number) => api.get<LeaderboardEntry[]>(`/gamification/leaderboard${limit ? `?limit=${limit}` : ''}`),
  },
  stats: {
    get: () => api.get<UserGamificationStats>('/gamification/stats'),
  },
};
