import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { automationEngine } from '@nexora/automation';

@Injectable()
export class AutomationService {
  getTemplates() {
    return automationEngine.getTemplates();
  }

  getTemplate(id: string) {
    const template = automationEngine.getTemplate(id);
    if (!template) throw new NotFoundException(`Template ${id} not found`);
    return template;
  }

  getWorkflows() {
    return automationEngine.getWorkflows();
  }

  getWorkflow(id: string) {
    const workflow = automationEngine.getWorkflow(id);
    if (!workflow) throw new NotFoundException(`Workflow ${id} not found`);
    return workflow;
  }

  createWorkflow(data: { name: string; description?: string; templateId?: string }) {
    return automationEngine.createWorkflow(data);
  }

  updateWorkflow(id: string, data: Record<string, unknown>) {
    const updated = automationEngine.updateWorkflow(id, data);
    if (!updated) throw new NotFoundException(`Workflow ${id} not found`);
    return updated;
  }

  deleteWorkflow(id: string) {
    const deleted = automationEngine.deleteWorkflow(id);
    if (!deleted) throw new NotFoundException(`Workflow ${id} not found`);
    return { deleted: true };
  }

  validateWorkflow(id: string) {
    const result = automationEngine.validateWorkflow(id);
    if (!result.valid) throw new BadRequestException(result.errors.join('; '));
    return result;
  }

  async runWorkflow(id: string, trigger: string = 'manual') {
    const workflow = automationEngine.getWorkflow(id);
    if (!workflow) throw new NotFoundException(`Workflow ${id} not found`);
    return automationEngine.executeWorkflow(id, trigger as any);
  }

  getWorkflowRuns(id: string) {
    const workflow = automationEngine.getWorkflow(id);
    if (!workflow) throw new NotFoundException(`Workflow ${id} not found`);
    return automationEngine.getWorkflowRuns(id);
  }
}
