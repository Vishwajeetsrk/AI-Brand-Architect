import { Injectable, Logger, NotFoundException } from '@nestjs/common';

interface ShowcaseProject {
  id: string; userId: string; title: string; description?: string;
  projectUrl?: string; imageUrl?: string; tags: string[];
  likes: number; comments: Comment[]; isPublic: boolean;
  createdAt: Date;
}

interface Comment {
  id: string; userId: string; content: string; createdAt: Date;
}

@Injectable()
export class ShowcaseService {
  private readonly logger = new Logger(ShowcaseService.name);
  private projects: ShowcaseProject[] = [];
  private counter = 0;

  async create(dto: { title: string; description?: string; projectUrl?: string; imageUrl?: string; tags?: string[]; isPublic?: boolean }, userId: string): Promise<ShowcaseProject> {
    const project: ShowcaseProject = {
      id: `showcase_${++this.counter}`,
      userId, title: dto.title, description: dto.description,
      projectUrl: dto.projectUrl, imageUrl: dto.imageUrl,
      tags: dto.tags || [], likes: 0, comments: [],
      isPublic: dto.isPublic ?? true,
      createdAt: new Date(),
    };
    this.projects.push(project);
    return project;
  }

  async listPublic(): Promise<ShowcaseProject[]> {
    return this.projects.filter(p => p.isPublic).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async listUser(userId: string): Promise<ShowcaseProject[]> {
    return this.projects.filter(p => p.userId === userId);
  }

  async get(id: string): Promise<ShowcaseProject> {
    const project = this.projects.find(p => p.id === id);
    if (!project) throw new NotFoundException(`Showcase project ${id} not found`);
    return project;
  }

  async like(id: string): Promise<ShowcaseProject> {
    const project = await this.get(id);
    project.likes++;
    return project;
  }

  async addComment(id: string, userId: string, content: string): Promise<ShowcaseProject> {
    const project = await this.get(id);
    project.comments.push({ id: `comment_${Date.now()}`, userId, content, createdAt: new Date() });
    return project;
  }
}
