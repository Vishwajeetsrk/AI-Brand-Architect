import { Injectable, Logger } from '@nestjs/common';

interface LeaderboardEntry {
  userId: string; userName: string; points: number; level: string;
  achievements: string[]; rank: number;
}

interface Achievement {
  id: string; name: string; description: string; icon: string;
  pointsRequired: number;
}

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);
  private points: Map<string, { total: number; history: { points: number; reason: string; date: Date }[] }> = new Map();
  private achievements: Achievement[] = [
    { id: 'first_login', name: 'First Steps', description: 'Logged in for the first time', icon: '👣', pointsRequired: 0 },
    { id: 'project_creator', name: 'Creator', description: 'Created your first project', icon: '🎨', pointsRequired: 100 },
    { id: 'learning_streak', name: 'Dedicated Learner', description: 'Completed 5 lessons', icon: '📚', pointsRequired: 500 },
    { id: 'collaborator', name: 'Team Player', description: 'Collaborated on a project', icon: '🤝', pointsRequired: 300 },
    { id: 'challenge_master', name: 'Challenge Master', description: 'Completed 10 coding challenges', icon: '🏆', pointsRequired: 1000 },
    { id: 'expert', name: 'NEXORA Expert', description: 'Earned 5000 points', icon: '💎', pointsRequired: 5000 },
  ];

  async getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
    const entries: LeaderboardEntry[] = [];
    for (const [userId, data] of this.points) {
      entries.push({
        userId, userName: `User ${userId.slice(0, 6)}`, points: data.total,
        level: this.getLevel(data.total),
        achievements: this.getAchievedIds(data.total),
        rank: 0,
      });
    }
    entries.sort((a, b) => b.points - a.points);
    return entries.slice(0, limit).map((e, i) => ({ ...e, rank: i + 1 }));
  }

  async awardPoints(userId: string, points: number, reason: string): Promise<{ total: number; level: string }> {
    if (!this.points.has(userId)) this.points.set(userId, { total: 0, history: [] });
    const data = this.points.get(userId)!;
    data.total += points;
    data.history.push({ points, reason, date: new Date() });
    return { total: data.total, level: this.getLevel(data.total) };
  }

  async getUserStats(userId: string): Promise<{ points: number; level: string; achievements: Achievement[]; history: any[] }> {
    const data = this.points.get(userId) || { total: 0, history: [] };
    return {
      points: data.total, level: this.getLevel(data.total),
      achievements: this.achievements.filter(a => data.total >= a.pointsRequired),
      history: data.history.slice(-20).reverse(),
    };
  }

  private getLevel(points: number): string {
    if (points >= 10000) return 'Diamond';
    if (points >= 5000) return 'Platinum';
    if (points >= 2000) return 'Gold';
    if (points >= 1000) return 'Silver';
    if (points >= 500) return 'Bronze';
    return 'Beginner';
  }

  private getAchievedIds(points: number): string[] {
    return this.achievements.filter(a => points >= a.pointsRequired).map(a => a.id);
  }
}
