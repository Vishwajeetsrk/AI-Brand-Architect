import { Injectable, Logger, NotFoundException } from '@nestjs/common';

interface CoachingSession {
  id: string; userId: string; title: string; description?: string;
  coachName?: string; topics: string[]; status: string; duration: number;
  scheduledAt?: string; notes?: string; feedback?: string; rating?: number;
  createdAt: Date;
}

@Injectable()
export class CoachingService {
  private readonly logger = new Logger(CoachingService.name);
  private sessions: CoachingSession[] = [];
  private counter = 0;

  async create(dto: { title: string; description?: string; coachName?: string; topics?: string[]; duration?: number; scheduledAt?: string }, userId: string): Promise<CoachingSession> {
    const session: CoachingSession = {
      id: `coach_${++this.counter}`,
      userId, title: dto.title, description: dto.description,
      coachName: dto.coachName || 'AI Coach',
      topics: dto.topics || [], status: 'scheduled',
      duration: dto.duration || 30, scheduledAt: dto.scheduledAt,
      createdAt: new Date(),
    };
    this.sessions.push(session);
    return session;
  }

  async list(userId: string): Promise<CoachingSession[]> {
    return this.sessions.filter(s => s.userId === userId);
  }

  async get(id: string, userId: string): Promise<CoachingSession> {
    const session = this.sessions.find(s => s.id === id && s.userId === userId);
    if (!session) throw new NotFoundException(`Session ${id} not found`);
    return session;
  }

  async updateStatus(id: string, userId: string, status: string): Promise<CoachingSession> {
    const session = await this.get(id, userId);
    session.status = status;
    return session;
  }

  async addFeedback(id: string, userId: string, feedback: string, rating: number): Promise<CoachingSession> {
    const session = await this.get(id, userId);
    session.feedback = feedback;
    session.rating = rating;
    session.status = 'completed';
    return session;
  }
}
