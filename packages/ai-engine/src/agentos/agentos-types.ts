export type AgentRole = 'planner' | 'executor' | 'coordinator' | 'supervisor' | 'specialist';

export type AgentStatus = 'registered' | 'initializing' | 'idle' | 'planning' | 'executing' | 'monitoring' | 'recovering' | 'shutting_down' | 'archived' | 'failed';

export type TaskStatus = 'pending' | 'scheduled' | 'running' | 'completed' | 'failed' | 'cancelled' | 'needs_review';

export type CoordinationStrategy = 'sequential' | 'parallel' | 'swarm' | 'pipeline' | 'hierarchy' | 'debate' | 'consensus';

export type SafetyLevel = 'strict' | 'moderate' | 'relaxed' | 'unrestricted';

export interface AgentProfile {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  systemPrompt: string;
  skills: string[];
  capabilities: string[];
  model: { provider: string; model: string; temperature?: number };
  maxConcurrency: number;
  safetyLevel: SafetyLevel;
  budgetLimit?: number;
  ownerId: string;
  organizationId?: string;
  status: AgentStatus;
  version: number;
  createdAt: number;
  updatedAt: number;
  lastHeartbeat?: number;
  metadata: Record<string, unknown>;
}

export interface AgentGoal {
  id: string;
  description: string;
  priority: number;
  deadline?: number;
  constraints?: string[];
  successCriteria: string[];
  parentGoalId?: string;
  subGoalIds: string[];
  requirements?: Record<string, unknown>;
  context?: Record<string, unknown>;
  status: TaskStatus;
  createdAt: number;
}

export interface AgentTaskPlan {
  id: string;
  goalId: string;
  goal: string;
  tasks: AgentTaskDef[];
  strategy: 'sequential' | 'parallel' | 'hybrid';
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;
  metadata?: Record<string, unknown>;
}

export interface AgentTaskDef {
  id: string;
  description: string;
  assignedAgentId?: string;
  assignedAgentRole?: AgentRole;
  priority: number;
  dependencies: string[];
  estimatedComplexity: number;
  requiredCapabilities: string[];
  status: TaskStatus;
  result?: string;
  error?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  metadata?: Record<string, unknown>;
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId?: string;
  topic: string;
  type: 'request' | 'response' | 'broadcast' | 'delegation' | 'coordination' | 'status' | 'error';
  payload: unknown;
  replyTo?: string;
  priority: number;
  timestamp: number;
  ttl?: number;
}

export interface ReflectionResult {
  taskId: string;
  evaluation: {
    score: number;
    passed: boolean;
    issues: string[];
    improvements: string[];
  };
  confidence: number;
  needsRetry: boolean;
  retryCount: number;
  suggestedChanges?: string;
  timestamp: number;
}

export interface CoordinationPlan {
  id: string;
  strategy: CoordinationStrategy;
  agents: string[];
  goal: string;
  steps: CoordinationStep[];
  status: TaskStatus;
  createdAt: number;
}

export interface CoordinationStep {
  id: string;
  agentId: string;
  action: string;
  input: unknown;
  dependsOn: string[];
  timeout: number;
}

export interface SafetyPolicy {
  id: string;
  name: string;
  description: string;
  rules: SafetyRule[];
  scope: 'agent' | 'organization' | 'global';
  priority: number;
  enabled: boolean;
}

export interface SafetyRule {
  id: string;
  type: 'budget_limit' | 'tool_restriction' | 'permission_check' | 'content_moderation' | 'approval_required' | 'rate_limit';
  config: Record<string, unknown>;
  action: 'allow' | 'deny' | 'flag' | 'escalate';
}
