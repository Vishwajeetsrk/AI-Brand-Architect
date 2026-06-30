import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma } from '@nexora/database';

@Injectable()
export class CareerService {
  private readonly logger = new Logger(CareerService.name);

  async createResume(dto: any, userId: string): Promise<any> {
    const { sections, ...resumeData } = dto;
    const resume = await prisma.resume.create({
      data: {
        ...resumeData,
        userId,
        sections: sections ? { create: sections.map((s: any, i: number) => ({ type: s.type, title: s.title, items: s.items, order: s.order ?? i })) } : undefined,
      },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    return resume;
  }

  async listResumes(userId: string): Promise<any> {
    return prisma.resume.findMany({ where: { userId }, include: { sections: { orderBy: { order: 'asc' } } }, orderBy: { updatedAt: 'desc' } });
  }

  async getResume(id: string, userId: string): Promise<any> {
    const resume = await prisma.resume.findFirst({ where: { id, userId }, include: { sections: { orderBy: { order: 'asc' } } } });
    if (!resume) throw new NotFoundException(`Resume ${id} not found`);
    return resume;
  }

  async updateResume(id: string, dto: any, userId: string): Promise<any> {
    const existing = await prisma.resume.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException(`Resume ${id} not found`);
    const { sections, ...resumeData } = dto;
    if (sections) {
      await prisma.resumeSection.deleteMany({ where: { resumeId: id } });
      await prisma.resumeSection.createMany({ data: sections.map((s: any, i: number) => ({ resumeId: id, type: s.type, title: s.title, items: s.items, order: s.order ?? i })) });
    }
    return prisma.resume.update({ where: { id }, data: resumeData, include: { sections: { orderBy: { order: 'asc' } } } });
  }

  async deleteResume(id: string, userId: string): Promise<void> {
    const existing = await prisma.resume.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException(`Resume ${id} not found`);
    await prisma.resume.delete({ where: { id } });
  }

  async createJob(dto: any, userId: string): Promise<any> {
    return prisma.job.create({ data: { ...dto, responsibilities: dto.responsibilities || [], userId } });
  }

  async listJobs(params: { search?: string; type?: string; workMode?: string; location?: string; isActive?: string; limit?: number; offset?: number }): Promise<any> {
    const where: any = { isActive: true };
    if (params.search) where.OR = [{ title: { contains: params.search, mode: 'insensitive' } }, { company: { contains: params.search, mode: 'insensitive' } }];
    if (params.type) where.type = params.type;
    if (params.workMode) where.workMode = params.workMode;
    if (params.location) where.location = { contains: params.location, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      prisma.job.findMany({ where, orderBy: { createdAt: 'desc' }, take: params.limit || 50, skip: params.offset || 0 }),
      prisma.job.count({ where }),
    ]);
    return { items, total };
  }

  async getJob(id: string): Promise<any> {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  async applyToJob(jobId: string, dto: any, userId: string): Promise<any> {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException(`Job ${jobId} not found`);
    return prisma.jobApplication.create({ data: { jobId, userId, resumeId: dto.resumeId, coverLetter: dto.coverLetter, answers: dto.answers || undefined, attachments: dto.attachments || [] } });
  }

  async listApplications(userId: string, jobId?: string): Promise<any> {
    const where: any = { userId };
    if (jobId) where.jobId = jobId;
    return prisma.jobApplication.findMany({ where, include: { job: true }, orderBy: { createdAt: 'desc' } });
  }

  async createInterview(dto: any, userId: string): Promise<any> {
    const questions = this.generateMockQuestions(dto.jobTitle || '', dto.type || 'MOCK', dto.questionsCount || 5);
    return prisma.interview.create({
      data: {
        title: dto.title,
        type: dto.type || 'MOCK',
        jobTitle: dto.jobTitle,
        companyName: dto.companyName,
        difficulty: dto.difficulty || 'medium',
        duration: dto.duration || 30,
        questionsCount: dto.questionsCount || 5,
        userId,
        questions: { create: questions.map((q, i) => ({ question: q, category: q.category, difficulty: q.difficulty || 'medium', order: i })) },
      },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
  }

  async listInterviews(userId: string): Promise<any> {
    return prisma.interview.findMany({ where: { userId }, include: { _count: { select: { questions: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async getInterview(id: string, userId: string): Promise<any> {
    const interview = await prisma.interview.findFirst({ where: { id, userId }, include: { questions: { orderBy: { order: 'asc' } } } });
    if (!interview) throw new NotFoundException(`Interview ${id} not found`);
    return interview;
  }

  async saveAnswer(questionId: string, dto: any, userId: string): Promise<any> {
    const question = await prisma.interviewQuestion.findUnique({ where: { id: questionId }, include: { interview: true } });
    if (!question || question.interview.userId !== userId) throw new NotFoundException(`Question ${questionId} not found`);
    return prisma.interviewQuestion.update({ where: { id: questionId }, data: { userAnswer: dto.answer, timeTaken: dto.timeTaken } });
  }

  async completeInterview(id: string, userId: string): Promise<any> {
    const interview = await prisma.interview.findFirst({ where: { id, userId }, include: { questions: true } });
    if (!interview) throw new NotFoundException(`Interview ${id} not found`);

    const answeredCount = interview.questions.filter(q => q.userAnswer).length;
    const totalScore = interview.questions.reduce((sum, q) => {
      if (!q.userAnswer) return sum;
      const qScore = Math.min(100, Math.max(0, q.userAnswer.length > 50 ? 70 + Math.floor(Math.random() * 30) : 40 + Math.floor(Math.random() * 30)));
      return sum + qScore;
    }, 0);
    const avgScore = answeredCount > 0 ? Math.round(totalScore / answeredCount) : 0;

    return prisma.interview.update({
      where: { id },
      data: { score: avgScore, feedback: `Completed ${answeredCount}/${interview.questionsCount} questions with an average score of ${avgScore}%.`, completedAt: new Date() },
      include: { questions: true },
    });
  }

  async createSkillAssessment(dto: any, userId: string): Promise<any> {
    const questions = this.generateSkillQuestions(dto.skill, dto.level || 'INTERMEDIATE', 10);
    return prisma.skillAssessment.create({
      data: { skill: dto.skill, level: dto.level || 'INTERMEDIATE', maxScore: 100, questions, userId },
    });
  }

  async listSkillAssessments(userId: string): Promise<any> {
    return prisma.skillAssessment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createPortfolio(dto: any, userId: string): Promise<any> {
    return prisma.portfolio.create({ data: { ...dto, socialLinks: dto.socialLinks || undefined, userId } });
  }

  async getPortfolio(userId: string): Promise<any> {
    const portfolio = await prisma.portfolio.findFirst({ where: { userId }, include: { projects: { orderBy: { order: 'asc' } } } });
    if (!portfolio) throw new NotFoundException(`Portfolio not found for user ${userId}`);
    return portfolio;
  }

  async updatePortfolio(id: string, dto: any, userId: string): Promise<any> {
    const existing = await prisma.portfolio.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundException(`Portfolio ${id} not found`);
    return prisma.portfolio.update({ where: { id }, data: dto, include: { projects: { orderBy: { order: 'asc' } } } });
  }

  async addPortfolioProject(portfolioId: string, dto: any, userId: string): Promise<any> {
    const portfolio = await prisma.portfolio.findFirst({ where: { id: portfolioId, userId } });
    if (!portfolio) throw new NotFoundException(`Portfolio ${portfolioId} not found`);
    const projects = await prisma.portfolioProject.findMany({ where: { portfolioId } });
    return prisma.portfolioProject.create({ data: { ...dto, portfolioId, order: projects.length } });
  }

  async getATSScore(resumeId: string, jobId: string, userId: string): Promise<any> {
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!resume || !job) throw new NotFoundException('Resume or Job not found');

    const resumeSkills = new Set(resume.skills.map(s => s.toLowerCase()));
    const reqSkills = new Set(job.requirements.map(r => r.toLowerCase()));
    const prefSkills = new Set(job.preferredSkills.map(p => p.toLowerCase()));

    const matchingRequired = [...reqSkills].filter(s => [...resumeSkills].some(rs => rs.includes(s) || s.includes(rs)));
    const matchingPreferred = [...prefSkills].filter(s => [...resumeSkills].some(rs => rs.includes(s) || s.includes(rs)));

    const requiredScore = reqSkills.size > 0 ? (matchingRequired.length / reqSkills.size) * 100 : 100;
    const preferredScore = prefSkills.size > 0 ? (matchingPreferred.length / prefSkills.size) * 100 : 100;
    const overallScore = Math.round(requiredScore * 0.7 + preferredScore * 0.3);

    return {
      overallScore,
      matchingSkills: matchingRequired.concat(matchingPreferred),
      missingSkills: [...reqSkills].filter(s => !matchingRequired.includes(s)).concat([...prefSkills].filter(s => !matchingPreferred.includes(s))),
      requiredMatch: Math.round(requiredScore),
      preferredMatch: Math.round(preferredScore),
    };
  }

  private generateMockQuestions(jobTitle: string, type: string, count: number): any[] {
    const technical = [
      { question: `Explain your experience with technologies relevant to ${jobTitle || 'this role'}.`, category: 'technical', difficulty: 'medium' },
      { question: 'Describe a challenging technical problem you solved and your approach.', category: 'technical', difficulty: 'hard' },
      { question: 'How do you stay updated with industry trends and new technologies?', category: 'technical', difficulty: 'easy' },
    ];
    const behavioral = [
      { question: 'Tell me about a time you worked successfully in a team.', category: 'behavioral', difficulty: 'medium' },
      { question: 'Describe a situation where you had to handle a difficult stakeholder.', category: 'behavioral', difficulty: 'hard' },
      { question: 'What is your greatest professional achievement?', category: 'behavioral', difficulty: 'medium' },
      { question: 'Tell me about a time you failed and what you learned.', category: 'behavioral', difficulty: 'medium' },
    ];
    const general = [
      { question: 'Why are you interested in this role?', category: 'general', difficulty: 'easy' },
      { question: 'Where do you see yourself in 5 years?', category: 'general', difficulty: 'easy' },
      { question: 'What are your greatest strengths and weaknesses?', category: 'general', difficulty: 'easy' },
    ];

    const pool = type === 'TECHNICAL' ? technical : type === 'BEHAVIORAL' ? behavioral : [...technical, ...behavioral, ...general];
    return pool.sort(() => Math.random() - 0.5).slice(0, count);
  }

  private generateSkillQuestions(skill: string, level: string, count: number): any[] {
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const levelIdx = levels.indexOf(level.toLowerCase());
    return Array.from({ length: count }, (_, i) => ({
      question: `${skill} ${level} question ${i + 1}: Explain the core concepts and best practices.`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: Math.floor(Math.random() * 4),
      difficulty: levels[Math.min(levelIdx, levels.length - 1)] || 'intermediate',
    }));
  }
}
