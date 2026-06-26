import { Injectable } from '@nestjs/common';
import { prisma, Workflow, WorkflowExecution } from '@nexora/database';

const TEMPLATES = [
  { id: 'content-pipeline', name: 'Content Pipeline', description: 'Generate, review, and publish content automatically', steps: [{ step: 'generate', provider: 'ai' }, { step: 'review', provider: 'human' }, { step: 'publish', provider: 'system' }] },
  { id: 'social-scheduler', name: 'Social Scheduler', description: 'Schedule and post social media content', steps: [{ step: 'create', provider: 'ai' }, { step: 'approve', provider: 'human' }, { step: 'schedule', provider: 'system' }] },
  { id: 'brand-monitor', name: 'Brand Monitor', description: 'Monitor brand mentions and sentiment', steps: [{ step: 'scrape', provider: 'system' }, { step: 'analyze', provider: 'ai' }, { step: 'alert', provider: 'system' }] },
];

@Injectable()
export class AutomationService {
  getTemplates(): any[] {
    return TEMPLATES;
  }

  getTemplate(id: string): any {
    const template = TEMPLATES.find(t => t.id === id);
    if (!template) return null;
    return template;
  }

  async getWorkflows(): Promise<Workflow[]> {
    return prisma.workflow.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getWorkflow(id: string): Promise<Workflow | null> {
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) return null;
    return workflow;
  }

  async createWorkflow(data: { name: string; description?: string; templateId?: string; userId?: string }): Promise<Workflow> {
    const template = data.templateId ? TEMPLATES.find(t => t.id === data.templateId) : null;
    return prisma.workflow.create({
      data: {
        name: data.name,
        description: data.description,
        steps: (template?.steps as any) || [],
        status: 'DRAFT',
        userId: data.userId || 'unknown',
      },
    });
  }

  async updateWorkflow(id: string, data: Record<string, unknown>): Promise<Workflow | null> {
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) return null;
    return prisma.workflow.update({
      where: { id },
      data: data as any,
    });
  }

  async deleteWorkflow(id: string): Promise<{ deleted: boolean } | null> {
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) return null;
    await prisma.workflow.delete({ where: { id } });
    return { deleted: true };
  }

  async validateWorkflow(id: string): Promise<{ valid: boolean; errors: string[] }> {
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) return { valid: false, errors: ['Workflow not found'] };
    const steps = workflow.steps as any[];
    if (!steps || steps.length === 0) return { valid: false, errors: ['No steps defined'] };
    return { valid: true, errors: [] };
  }

  async runWorkflow(id: string, trigger: string = 'manual'): Promise<WorkflowExecution | null> {
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) return null;
    return prisma.workflowExecution.create({
      data: {
        workflowId: id,
        status: 'RUNNING',
        input: { trigger },
        userId: workflow.userId,
      },
    });
  }

  async getWorkflowRuns(id: string): Promise<WorkflowExecution[] | null> {
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) return null;
    return prisma.workflowExecution.findMany({
      where: { workflowId: id },
      orderBy: { startedAt: 'desc' },
    });
  }
}
