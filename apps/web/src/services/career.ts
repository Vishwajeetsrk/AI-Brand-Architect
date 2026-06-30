import { api } from './api';

export interface Resume { id: string; title: string; fullName: string; email: string; phone?: string; location?: string; headline?: string; summary?: string; skills: string[]; templateStyle: string; isPublic: boolean; sections: ResumeSection[]; createdAt: string; updatedAt: string; }
export interface ResumeSection { id: string; type: string; title: string; items: any; order: number; }
export interface Job { id: string; title: string; company: string; companyLogo?: string; location: string; workMode: string; type: string; department?: string; salaryMin?: number; salaryMax?: number; description: string; requirements: string[]; preferredSkills: string[]; benefits: string[]; tags: string[]; isActive: boolean; createdAt: string; }
export interface JobApplication { id: string; jobId: string; job: Job; status: string; coverLetter?: string; matchScore?: number; createdAt: string; }
export interface Interview { id: string; title: string; type: string; jobTitle?: string; companyName?: string; difficulty: string; questionsCount: number; score?: number; feedback?: string; completedAt?: string; questions: InterviewQuestion[]; createdAt: string; }
export interface InterviewQuestion { id: string; question: string; category: string; difficulty: string; userAnswer?: string; modelAnswer?: string; score?: number; order: number; }
export interface Portfolio { id: string; title: string; subtitle?: string; bio?: string; skills: string[]; isPublic: boolean; projects: PortfolioProject[]; }
export interface PortfolioProject { id: string; title: string; description?: string; imageUrl?: string; projectUrl?: string; tags: string[]; technologies: string[]; order: number; }
export interface AtsScore { overallScore: number; matchingSkills: string[]; missingSkills: string[]; requiredMatch: number; preferredMatch: number; }

export const careerService = {
  resumes: {
    list: () => api.get<Resume[]>('/career/resumes'),
    get: (id: string) => api.get<Resume>(`/career/resumes/${id}`),
    create: (d: any) => api.post<Resume>('/career/resumes', d),
    update: (id: string, d: any) => api.put<Resume>(`/career/resumes/${id}`, d),
    delete: (id: string) => api.delete(`/career/resumes/${id}`),
  },
  jobs: {
    list: (params?: Record<string, string>) => api.get<{ items: Job[]; total: number }>(`/career/jobs${params ? '?' + new URLSearchParams(params).toString() : ''}`),
    get: (id: string) => api.get<Job>(`/career/jobs/${id}`),
    apply: (jobId: string, d: any) => api.post<JobApplication>(`/career/jobs/${jobId}/apply`, d),
  },
  applications: {
    list: (jobId?: string) => api.get<JobApplication[]>(`/career/applications${jobId ? `?jobId=${jobId}` : ''}`),
  },
  interviews: {
    list: () => api.get<Interview[]>('/career/interviews'),
    get: (id: string) => api.get<Interview>(`/career/interviews/${id}`),
    create: (d: any) => api.post<Interview>('/career/interviews', d),
    saveAnswer: (id: string, questionId: string, answer: string, timeTaken?: number) => api.post(`/career/interviews/${id}/questions/${questionId}/answer`, { answer, timeTaken }),
    complete: (id: string) => api.post<Interview>(`/career/interviews/${id}/complete`),
  },
  skillAssessments: {
    list: () => api.get<any[]>('/career/skill-assessments'),
    create: (d: any) => api.post<any>('/career/skill-assessments', d),
  },
  portfolios: {
    get: () => api.get<Portfolio>('/career/portfolios/me'),
    create: (d: any) => api.post<Portfolio>('/career/portfolios', d),
    update: (id: string, d: any) => api.put<Portfolio>(`/career/portfolios/${id}`, d),
    addProject: (id: string, d: any) => api.post<PortfolioProject>(`/career/portfolios/${id}/projects`, d),
  },
  atsScore: (resumeId: string, jobId: string) => api.get<AtsScore>(`/career/ats-score?resumeId=${resumeId}&jobId=${jobId}`),
  roadmaps: {
    generate: (d: any) => api.post<any>('/career/roadmaps/generate', d),
    list: () => api.get<any[]>('/career/roadmaps'),
    get: (id: string) => api.get<any>(`/career/roadmaps/${id}`),
  },
};
