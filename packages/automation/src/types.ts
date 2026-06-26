export type TriggerType =
  | 'webhook'
  | 'schedule'
  | 'event'
  | 'manual'
  | 'form_submitted'
  | 'brand_created'
  | 'asset_uploaded';

export type ActionType =
  | 'ai_generate'
  | 'send_email'
  | 'create_asset'
  | 'slack_notify'
  | 'export'
  | 'transform'
  | 'approval';

export type NodeType = 'trigger' | 'action' | 'condition' | 'delay' | 'output';

export type WorkflowStatus = 'active' | 'paused' | 'draft';

export type RunStatus = 'running' | 'completed' | 'failed' | 'cancelled';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  nextNodeIds: string[];
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  condition?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  estimatedDuration: string;
  popularity: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: TriggerType;
  schedule?: string;
  webhookUrl?: string;
  conditions: string[];
  actions: ActionType[];
  status: 'active' | 'paused';
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  startedAt: string;
  completedAt?: string;
  status: RunStatus;
  trigger: TriggerType;
  nodesCompleted: number;
  error?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  runCount: number;
  lastRun?: string;
}
