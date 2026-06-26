import type {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  WorkflowTemplate,
  WorkflowRun,
  AutomationRule,
  TriggerType,
  WorkflowStatus,
} from './types';

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'tpl-brand-kit',
    name: 'Brand Kit Generator',
    description: 'Automatically generate a full brand kit when a new brand is created — logo, colors, typography, and guidelines.',
    category: 'Branding',
    estimatedDuration: '~3 min',
    popularity: 92,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Brand Created', config: { event: 'brand_created' }, position: { x: 50, y: 200 }, nextNodeIds: ['n2'] },
      { id: 'n2', type: 'action', label: 'AI Generate Logo', config: { action: 'ai_generate', prompt: 'Generate logo from brand name and industry' }, position: { x: 280, y: 200 }, nextNodeIds: ['n3'] },
      { id: 'n3', type: 'action', label: 'Generate Color Palette', config: { action: 'ai_generate', prompt: 'Extract brand colors from logo concept' }, position: { x: 510, y: 200 }, nextNodeIds: ['n4'] },
      { id: 'n4', type: 'action', label: 'Create Guidelines', config: { action: 'ai_generate', prompt: 'Generate brand usage guidelines' }, position: { x: 740, y: 200 }, nextNodeIds: ['n5'] },
      { id: 'n5', type: 'output', label: 'Save Brand Kit', config: { action: 'create_asset', folder: 'brand-kits' }, position: { x: 970, y: 200 }, nextNodeIds: [] },
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
      { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
      { id: 'e3', sourceNodeId: 'n3', targetNodeId: 'n4' },
      { id: 'e4', sourceNodeId: 'n4', targetNodeId: 'n5' },
    ],
  },
  {
    id: 'tpl-social-publish',
    name: 'Social Media Publisher',
    description: 'Create, review, and publish social media content across multiple platforms with approval gates.',
    category: 'Marketing',
    estimatedDuration: '~5 min',
    popularity: 88,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Content Scheduled', config: { event: 'schedule' }, position: { x: 50, y: 200 }, nextNodeIds: ['n2'] },
      { id: 'n2', type: 'action', label: 'AI Generate Post', config: { action: 'ai_generate', platform: 'multi' }, position: { x: 280, y: 200 }, nextNodeIds: ['n3'] },
      { id: 'n3', type: 'condition', label: 'Requires Approval?', config: { field: 'approval_required', operator: 'equals', value: true }, position: { x: 510, y: 200 }, nextNodeIds: ['n4', 'n5'] },
      { id: 'n4', type: 'action', label: 'Send for Review', config: { action: 'approval', channel: 'slack' }, position: { x: 510, y: 350 }, nextNodeIds: ['n5'] },
      { id: 'n5', type: 'action', label: 'Publish to Platforms', config: { action: 'export', platforms: ['twitter', 'linkedin', 'instagram'] }, position: { x: 740, y: 200 }, nextNodeIds: ['n6'] },
      { id: 'n6', type: 'output', label: 'Log Published', config: { action: 'create_asset' }, position: { x: 970, y: 200 }, nextNodeIds: [] },
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
      { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
      { id: 'e3', sourceNodeId: 'n3', targetNodeId: 'n4', condition: 'approval_required == true', label: 'Yes' },
      { id: 'e4', sourceNodeId: 'n3', targetNodeId: 'n5', condition: 'approval_required == false', label: 'No' },
      { id: 'e5', sourceNodeId: 'n4', targetNodeId: 'n5' },
      { id: 'e6', sourceNodeId: 'n5', targetNodeId: 'n6' },
    ],
  },
  {
    id: 'tpl-approval-flow',
    name: 'Content Approval Flow',
    description: 'Route content through multi-stage approval with notifications, escalations, and feedback loops.',
    category: 'Collaboration',
    estimatedDuration: '~2 min',
    popularity: 85,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Content Submitted', config: { event: 'form_submitted' }, position: { x: 50, y: 200 }, nextNodeIds: ['n2'] },
      { id: 'n2', type: 'action', label: 'Notify Reviewer', config: { action: 'slack_notify', channel: '#reviews' }, position: { x: 280, y: 200 }, nextNodeIds: ['n3'] },
      { id: 'n3', type: 'condition', label: 'Approved?', config: { field: 'status' }, position: { x: 510, y: 200 }, nextNodeIds: ['n4', 'n5'] },
      { id: 'n4', type: 'action', label: 'Publish Content', config: { action: 'export' }, position: { x: 740, y: 150 }, nextNodeIds: ['n6'] },
      { id: 'n5', type: 'action', label: 'Send Revision Request', config: { action: 'send_email', template: 'revision-request' }, position: { x: 740, y: 300 }, nextNodeIds: [] },
      { id: 'n6', type: 'output', label: 'Notify Author', config: { action: 'slack_notify', message: 'Your content is live!' }, position: { x: 970, y: 150 }, nextNodeIds: [] },
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
      { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
      { id: 'e3', sourceNodeId: 'n3', targetNodeId: 'n4', label: 'Approved', condition: 'approved' },
      { id: 'e4', sourceNodeId: 'n3', targetNodeId: 'n5', label: 'Rejected', condition: 'rejected' },
      { id: 'e5', sourceNodeId: 'n4', targetNodeId: 'n6' },
    ],
  },
  {
    id: 'tpl-asset-transform',
    name: 'Asset Transformation Pipeline',
    description: 'Auto-resize, convert formats, and optimize uploaded brand assets for multiple use cases.',
    category: 'Assets',
    estimatedDuration: '~1 min',
    popularity: 79,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Asset Uploaded', config: { event: 'asset_uploaded' }, position: { x: 50, y: 200 }, nextNodeIds: ['n2'] },
      { id: 'n2', type: 'action', label: 'Resize for Web', config: { action: 'transform', width: 1200, height: 630 }, position: { x: 280, y: 200 }, nextNodeIds: ['n3'] },
      { id: 'n3', type: 'action', label: 'Resize for Social', config: { action: 'transform', width: 1080, height: 1080 }, position: { x: 280, y: 350 }, nextNodeIds: ['n4'] },
      { id: 'n4', type: 'action', label: 'Convert to WebP', config: { action: 'transform', format: 'webp', quality: 85 }, position: { x: 510, y: 200 }, nextNodeIds: ['n5'] },
      { id: 'n5', type: 'output', label: 'Save All Variants', config: { action: 'create_asset', suffix: '-optimized' }, position: { x: 740, y: 200 }, nextNodeIds: [] },
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
      { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
      { id: 'e3', sourceNodeId: 'n2', targetNodeId: 'n4' },
      { id: 'e4', sourceNodeId: 'n3', targetNodeId: 'n4' },
      { id: 'e5', sourceNodeId: 'n4', targetNodeId: 'n5' },
    ],
  },
  {
    id: 'tpl-email-campaign',
    name: 'Email Campaign Automation',
    description: 'Design, generate, and send targeted email campaigns triggered by user actions or schedules.',
    category: 'Marketing',
    estimatedDuration: '~4 min',
    popularity: 82,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Form Submitted', config: { event: 'form_submitted', formId: 'newsletter-signup' }, position: { x: 50, y: 200 }, nextNodeIds: ['n2'] },
      { id: 'n2', type: 'delay', label: 'Wait 1 Hour', config: { duration: 3600000 }, position: { x: 280, y: 200 }, nextNodeIds: ['n3'] },
      { id: 'n3', type: 'action', label: 'AI Generate Email', config: { action: 'ai_generate', type: 'welcome_email' }, position: { x: 510, y: 200 }, nextNodeIds: ['n4'] },
      { id: 'n4', type: 'condition', label: 'Has Discount Code?', config: { field: 'has_discount' }, position: { x: 510, y: 350 }, nextNodeIds: ['n5', 'n6'] },
      { id: 'n5', type: 'action', label: 'Send with Offer', config: { action: 'send_email', template: 'welcome-offer' }, position: { x: 740, y: 150 }, nextNodeIds: ['n7'] },
      { id: 'n6', type: 'action', label: 'Send Standard', config: { action: 'send_email', template: 'welcome-standard' }, position: { x: 740, y: 350 }, nextNodeIds: ['n7'] },
      { id: 'n7', type: 'output', label: 'Log Campaign', config: { action: 'create_asset', folder: 'email-campaigns' }, position: { x: 970, y: 200 }, nextNodeIds: [] },
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
      { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
      { id: 'e3', sourceNodeId: 'n3', targetNodeId: 'n4' },
      { id: 'e4', sourceNodeId: 'n4', targetNodeId: 'n5', label: 'Yes', condition: 'has_discount == true' },
      { id: 'e5', sourceNodeId: 'n4', targetNodeId: 'n6', label: 'No', condition: 'has_discount == false' },
      { id: 'e6', sourceNodeId: 'n5', targetNodeId: 'n7' },
      { id: 'e7', sourceNodeId: 'n6', targetNodeId: 'n7' },
    ],
  },
  {
    id: 'tpl-brand-audit',
    name: 'Brand Health Audit',
    description: 'Periodically audit brand assets, check consistency, and generate a brand health report.',
    category: 'Branding',
    estimatedDuration: '~6 min',
    popularity: 74,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Weekly Schedule', config: { event: 'schedule', cron: '0 9 * * 1' }, position: { x: 50, y: 200 }, nextNodeIds: ['n2'] },
      { id: 'n2', type: 'action', label: 'Scan Brand Assets', config: { action: 'ai_generate', task: 'audit-assets' }, position: { x: 280, y: 200 }, nextNodeIds: ['n3'] },
      { id: 'n3', type: 'action', label: 'Check Consistency', config: { action: 'transform', compareWith: 'brand-guidelines' }, position: { x: 510, y: 200 }, nextNodeIds: ['n4'] },
      { id: 'n4', type: 'condition', label: 'Issues Found?', config: { field: 'issue_count', operator: 'greater_than', value: 0 }, position: { x: 740, y: 150 }, nextNodeIds: ['n5', 'n6'] },
      { id: 'n5', type: 'action', label: 'Generate Report', config: { action: 'export', format: 'pdf' }, position: { x: 740, y: 300 }, nextNodeIds: ['n7'] },
      { id: 'n6', type: 'output', label: 'Log All Clear', config: { action: 'create_asset', message: 'All assets consistent' }, position: { x: 970, y: 150 }, nextNodeIds: [] },
      { id: 'n7', type: 'output', label: 'Slack Alert Team', config: { action: 'slack_notify', channel: '#brand-team' }, position: { x: 970, y: 300 }, nextNodeIds: [] },
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
      { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
      { id: 'e3', sourceNodeId: 'n3', targetNodeId: 'n4' },
      { id: 'e4', sourceNodeId: 'n4', targetNodeId: 'n5', label: 'Yes', condition: 'issues_found' },
      { id: 'e5', sourceNodeId: 'n4', targetNodeId: 'n6', label: 'No', condition: 'no_issues' },
      { id: 'e6', sourceNodeId: 'n5', targetNodeId: 'n7' },
    ],
  },
  {
    id: 'tpl-slack-bot',
    name: 'Slack Command Processor',
    description: 'Handle slash commands from Slack to generate content, create assets, or trigger workflows on demand.',
    category: 'Integrations',
    estimatedDuration: '~1 min',
    popularity: 71,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Slack /command', config: { event: 'webhook', method: 'POST', path: '/slack/commands' }, position: { x: 50, y: 200 }, nextNodeIds: ['n2'] },
      { id: 'n2', type: 'condition', label: 'Parse Command', config: { field: 'command_text' }, position: { x: 280, y: 200 }, nextNodeIds: ['n3', 'n4', 'n5'] },
      { id: 'n3', type: 'action', label: 'Generate Image', config: { action: 'ai_generate', type: 'image' }, position: { x: 280, y: 350 }, nextNodeIds: ['n6'] },
      { id: 'n4', type: 'action', label: 'Generate Text', config: { action: 'ai_generate', type: 'text' }, position: { x: 510, y: 200 }, nextNodeIds: ['n6'] },
      { id: 'n5', type: 'action', label: 'Export Asset', config: { action: 'export' }, position: { x: 510, y: 350 }, nextNodeIds: ['n6'] },
      { id: 'n6', type: 'output', label: 'Reply to Slack', config: { action: 'slack_notify', thread: true }, position: { x: 740, y: 200 }, nextNodeIds: [] },
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
      { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3', label: '/imagine', condition: 'command == /imagine' },
      { id: 'e3', sourceNodeId: 'n2', targetNodeId: 'n4', label: '/write', condition: 'command == /write' },
      { id: 'e4', sourceNodeId: 'n2', targetNodeId: 'n5', label: '/export', condition: 'command == /export' },
      { id: 'e5', sourceNodeId: 'n3', targetNodeId: 'n6' },
      { id: 'e6', sourceNodeId: 'n4', targetNodeId: 'n6' },
      { id: 'e7', sourceNodeId: 'n5', targetNodeId: 'n6' },
    ],
  },
  {
    id: 'tpl-multi-channel-campaign',
    name: 'Multi-Channel Campaign Launch',
    description: 'Coordinate a coordinated campaign launch across email, social, and web with staggered timing.',
    category: 'Marketing',
    estimatedDuration: '~8 min',
    popularity: 77,
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Campaign Approved', config: { event: 'approval', type: 'campaign' }, position: { x: 50, y: 200 }, nextNodeIds: ['n2'] },
      { id: 'n2', type: 'action', label: 'Generate Email Copy', config: { action: 'ai_generate', type: 'email' }, position: { x: 280, y: 100 }, nextNodeIds: ['n5'] },
      { id: 'n3', type: 'action', label: 'Generate Social Posts', config: { action: 'ai_generate', type: 'social' }, position: { x: 280, y: 300 }, nextNodeIds: ['n5'] },
      { id: 'n4', type: 'delay', label: 'Wait Until Launch', config: { duration: null, until: 'launch_date' }, position: { x: 510, y: 200 }, nextNodeIds: ['n6'] },
      { id: 'n5', type: 'action', label: 'Stage Content', config: { action: 'create_asset', folder: 'campaign-draft' }, position: { x: 510, y: 100 }, nextNodeIds: ['n4'] },
      { id: 'n6', type: 'action', label: 'Send Emails', config: { action: 'send_email', list: 'all-subscribers' }, position: { x: 740, y: 100 }, nextNodeIds: ['n8'] },
      { id: 'n7', type: 'action', label: 'Publish Social', config: { action: 'export', platforms: ['twitter', 'linkedin'] }, position: { x: 740, y: 300 }, nextNodeIds: ['n8'] },
      { id: 'n8', type: 'output', label: 'Update Campaign Status', config: { action: 'create_asset', status: 'live' }, position: { x: 970, y: 200 }, nextNodeIds: [] },
    ],
    edges: [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
      { id: 'e2', sourceNodeId: 'n1', targetNodeId: 'n3' },
      { id: 'e3', sourceNodeId: 'n2', targetNodeId: 'n5' },
      { id: 'e4', sourceNodeId: 'n3', targetNodeId: 'n5' },
      { id: 'e5', sourceNodeId: 'n5', targetNodeId: 'n4' },
      { id: 'e6', sourceNodeId: 'n4', targetNodeId: 'n6' },
      { id: 'e7', sourceNodeId: 'n4', targetNodeId: 'n7' },
      { id: 'e8', sourceNodeId: 'n6', targetNodeId: 'n8' },
      { id: 'e9', sourceNodeId: 'n7', targetNodeId: 'n8' },
    ],
  },
];

export class AutomationEngine {
  private workflows: Map<string, Workflow> = new Map();
  private runs: Map<string, WorkflowRun[]> = new Map();
  private rules: Map<string, AutomationRule> = new Map();

  getTemplates(): WorkflowTemplate[] {
    return TEMPLATES;
  }

  getTemplate(id: string): WorkflowTemplate | undefined {
    return TEMPLATES.find((t) => t.id === id);
  }

  createWorkflow(data: { name: string; description?: string; templateId?: string }): Workflow {
    const id = crypto.randomUUID();
    const template = data.templateId ? this.getTemplate(data.templateId) : undefined;
    const workflow: Workflow = {
      id,
      name: data.name,
      description: data.description || '',
      nodes: template ? JSON.parse(JSON.stringify(template.nodes)) : [],
      edges: template ? JSON.parse(JSON.stringify(template.edges)) : [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runCount: 0,
    };
    this.workflows.set(id, workflow);
    return workflow;
  }

  getWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  updateWorkflow(id: string, data: Partial<Workflow>): Workflow | undefined {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;
    const updated = { ...workflow, ...data, id: workflow.id, updatedAt: new Date().toISOString() };
    this.workflows.set(id, updated);
    return updated;
  }

  deleteWorkflow(id: string): boolean {
    return this.workflows.delete(id);
  }

  validateWorkflow(id: string): { valid: boolean; errors: string[] } {
    const workflow = this.workflows.get(id);
    if (!workflow) return { valid: false, errors: ['Workflow not found'] };
    const errors: string[] = [];
    if (workflow.nodes.length === 0) {
      errors.push('Workflow has no nodes');
      return { valid: false, errors };
    }
    const triggers = workflow.nodes.filter((n) => n.type === 'trigger');
    if (triggers.length === 0) errors.push('Workflow must have at least one trigger node');
    if (triggers.length > 1) errors.push('Workflow should have only one trigger node');
    const nodeIds = new Set(workflow.nodes.map((n) => n.id));
    for (const edge of workflow.edges) {
      if (!nodeIds.has(edge.sourceNodeId)) errors.push(`Edge ${edge.id}: source node ${edge.sourceNodeId} not found`);
      if (!nodeIds.has(edge.targetNodeId)) errors.push(`Edge ${edge.targetNodeId}: target node ${edge.targetNodeId} not found`);
    }
    const nodesWithoutOutput = workflow.nodes.filter((n) => n.nextNodeIds.length === 0);
    const hasOutput = workflow.nodes.some((n) => n.type === 'output');
    if (nodesWithoutOutput.length > 0 && !hasOutput) {
      errors.push('Workflow should end with an output node');
    }
    return { valid: errors.length === 0, errors };
  }

  async executeWorkflow(id: string, trigger: TriggerType = 'manual'): Promise<WorkflowRun> {
    const workflow = this.workflows.get(id);
    if (!workflow) throw new Error(`Workflow ${id} not found`);
    const validation = this.validateWorkflow(id);
    if (!validation.valid) throw new Error(`Workflow validation failed: ${validation.errors.join('; ')}`);
    const run: WorkflowRun = {
      id: crypto.randomUUID(),
      workflowId: id,
      startedAt: new Date().toISOString(),
      status: 'running',
      trigger,
      nodesCompleted: 0,
    };
    const existingRuns = this.runs.get(id) || [];
    existingRuns.push(run);
    this.runs.set(id, existingRuns);
    try {
      for (const node of workflow.nodes) {
        await this.simulateNodeExecution(node);
        run.nodesCompleted++;
      }
      run.status = 'completed';
      run.completedAt = new Date().toISOString();
      workflow.runCount++;
      workflow.lastRun = run.completedAt;
      workflow.status = 'active';
    } catch (err) {
      run.status = 'failed';
      run.completedAt = new Date().toISOString();
      run.error = err instanceof Error ? err.message : 'Unknown error';
    }
    return run;
  }

  getWorkflowRuns(workflowId: string): WorkflowRun[] {
    return this.runs.get(workflowId) || [];
  }

  private async simulateNodeExecution(node: WorkflowNode): Promise<void> {
    const delays: Record<string, number> = {
      trigger: 100,
      action: 600,
      condition: 200,
      delay: 50,
      output: 300,
    };
    await new Promise((resolve) => setTimeout(resolve, delays[node.type] || 200));
  }

  createRule(rule: Omit<AutomationRule, 'id'>): AutomationRule {
    const id = crypto.randomUUID();
    const newRule: AutomationRule = { id, ...rule };
    this.rules.set(id, newRule);
    return newRule;
  }

  getRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  matchTrigger(event: TriggerType, payload: Record<string, unknown>): AutomationRule[] {
    return Array.from(this.rules.values()).filter(
      (rule) => rule.status === 'active' && rule.trigger === event
    );
  }
}

export const automationEngine = new AutomationEngine();

const SAMPLE_WORKFLOWS: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Brand Kit Auto-Generator',
    description: 'Auto-generates brand kits from new brand submissions',
    nodes: TEMPLATES[0].nodes,
    edges: TEMPLATES[0].edges,
    status: 'active',
    runCount: 342,
    lastRun: new Date().toISOString(),
  },
  {
    name: 'Social Media Approval Queue',
    description: 'Multi-platform social content with approval gates',
    nodes: TEMPLATES[1].nodes,
    edges: TEMPLATES[1].edges,
    status: 'active',
    runCount: 187,
    lastRun: new Date().toISOString(),
  },
  {
    name: 'Asset Optimization Pipeline',
    description: 'Auto-resize and convert uploaded brand assets',
    nodes: TEMPLATES[3].nodes,
    edges: TEMPLATES[3].edges,
    status: 'active',
    runCount: 892,
    lastRun: new Date().toISOString(),
  },
  {
    name: 'Weekly Brand Health Report',
    description: 'Scheduled brand consistency audit and reporting',
    nodes: TEMPLATES[5].nodes,
    edges: TEMPLATES[5].edges,
    status: 'paused',
    runCount: 48,
    lastRun: new Date().toISOString(),
  },
];

for (const sw of SAMPLE_WORKFLOWS) {
  const w = automationEngine.createWorkflow({ name: sw.name, description: sw.description });
  w.nodes = JSON.parse(JSON.stringify(sw.nodes));
  w.edges = JSON.parse(JSON.stringify(sw.edges));
  w.status = sw.status as WorkflowStatus;
  w.runCount = sw.runCount;
  w.lastRun = sw.lastRun;
  automationEngine.updateWorkflow(w.id, w);
}
