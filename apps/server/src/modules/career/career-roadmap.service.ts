import { Injectable, Logger, NotFoundException } from '@nestjs/common';

interface CareerRoadmap {
  id: string; userId: string; currentRole: string; targetRole?: string;
  skills: string[]; industry?: string; experienceYears: number;
  milestones: { title: string; duration: string; skills: string[]; resources: string[] }[];
  timeline: { phase: string; duration: string; actions: string[] }[];
  createdAt: Date;
}

@Injectable()
export class CareerRoadmapService {
  private readonly logger = new Logger(CareerRoadmapService.name);
  private roadmaps: CareerRoadmap[] = [];
  private counter = 0;

  async generate(dto: { currentRole: string; targetRole?: string; skills?: string[]; industry?: string; experienceYears?: number }, userId: string): Promise<CareerRoadmap> {
    const roadmap: CareerRoadmap = {
      id: `roadmap_${++this.counter}`,
      userId, currentRole: dto.currentRole, targetRole: dto.targetRole,
      skills: dto.skills || [], industry: dto.industry,
      experienceYears: dto.experienceYears || 0,
      milestones: this.generateMilestones(dto),
      timeline: this.generateTimeline(dto),
      createdAt: new Date(),
    };
    this.roadmaps.push(roadmap);
    return roadmap;
  }

  async list(userId: string): Promise<CareerRoadmap[]> {
    return this.roadmaps.filter(r => r.userId === userId);
  }

  async get(id: string, userId: string): Promise<CareerRoadmap> {
    const roadmap = this.roadmaps.find(r => r.id === id && r.userId === userId);
    if (!roadmap) throw new NotFoundException(`Career roadmap ${id} not found`);
    return roadmap;
  }

  private generateMilestones(dto: any): CareerRoadmap['milestones'] {
    const target = dto.targetRole || 'Senior Role';
    return [
      { title: `Master ${dto.currentRole} Fundamentals`, duration: '3-6 months', skills: dto.skills || [], resources: ['Online Courses', 'Industry Certifications'] },
      { title: `Transition to ${target}`, duration: '6-12 months', skills: [...(dto.skills || []), 'Leadership', 'Strategic Thinking'], resources: ['Mentorship Programs', 'Advanced Certifications'] },
      { title: `Excel as ${target}`, duration: '12-24 months', skills: ['Team Management', 'Cross-functional Collaboration', 'Industry Expertise'], resources: ['Executive Coaching', 'Industry Conferences'] },
    ];
  }

  private generateTimeline(dto: any): CareerRoadmap['timeline'] {
    return [
      { phase: 'Foundation', duration: '0-6 months', actions: ['Assess current skills', 'Identify skill gaps', 'Create learning plan', 'Build portfolio projects'] },
      { phase: 'Growth', duration: '6-12 months', actions: ['Pursue advanced certifications', 'Take on leadership opportunities', 'Network with industry peers', 'Contribute to open source'] },
      { phase: 'Advanced', duration: '12-24 months', actions: ['Mentor others', 'Speak at conferences', 'Lead strategic initiatives', 'Build industry authority'] },
    ];
  }
}
