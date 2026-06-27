import { SafetyPolicy, SafetyRule, AgentTaskDef, AgentProfile } from './agentos-types';

export class SafetyGovernance {
  private policies: Map<string, SafetyPolicy> = new Map();
  private auditLog: AuditEntry[] = [];
  private agentBudgets: Map<string, number> = new Map();

  constructor() {
    this.registerDefaultPolicies();
  }

  private registerDefaultPolicies(): void {
    this.addPolicy({
      id: 'default-safety',
      name: 'Default Safety Policy',
      description: 'Basic safety restrictions for all agents',
      rules: [
        {
          id: 'rate-limit-default',
          type: 'rate_limit',
          config: { maxRequestsPerMinute: 60, maxTokensPerMinute: 100000 },
          action: 'deny',
        },
        {
          id: 'content-moderation-default',
          type: 'content_moderation',
          config: { blockedCategories: ['harmful', 'illegal', 'explicit'] },
          action: 'flag',
        },
      ],
      scope: 'global',
      priority: 10,
      enabled: true,
    });
  }

  addPolicy(policy: SafetyPolicy): void {
    this.policies.set(policy.id, policy);
  }

  removePolicy(policyId: string): void {
    this.policies.delete(policyId);
  }

  async checkTaskAllowed(task: AgentTaskDef, agent: AgentProfile): Promise<SafetyCheckResult> {
    const violations: SafetyViolation[] = [];
    const applicablePolicies = this.getApplicablePolicies(agent);

    for (const policy of applicablePolicies) {
      for (const rule of policy.rules) {
        const result = await this.evaluateRule(rule, task, agent);
        if (result.violated) violations.push(result);
      }
    }

    if (violations.length > 0) {
      this.logAuditEntry({
        agentId: agent.id,
        taskId: task.id,
        action: 'task_check',
        violations,
        timestamp: Date.now(),
      });
    }

    const denied = violations.some(v => v.action === 'deny');
    return { allowed: !denied, violations };
  }

  async checkBudgetAllowed(agentId: string, cost: number): Promise<boolean> {
    const remaining = this.agentBudgets.get(agentId) ?? Infinity;
    if (cost > remaining) {
      this.logAuditEntry({
        agentId,
        taskId: 'budget-check',
        action: 'budget_limit',
        violations: [{ ruleId: 'budget-limit', message: `Budget exceeded: ${cost} > ${remaining}`, action: 'deny', violated: true }],
        timestamp: Date.now(),
      });
      return false;
    }
    return true;
  }

  setAgentBudget(agentId: string, budget: number): void {
    this.agentBudgets.set(agentId, budget);
  }

  deductBudget(agentId: string, amount: number): void {
    const current = this.agentBudgets.get(agentId) ?? Infinity;
    if (current !== Infinity) this.agentBudgets.set(agentId, current - amount);
  }

  getAuditLog(limit: number = 100): AuditEntry[] {
    return this.auditLog.slice(-limit);
  }

  private getApplicablePolicies(agent: AgentProfile): SafetyPolicy[] {
    const applicable: SafetyPolicy[] = [];
    for (const policy of this.policies.values()) {
      if (!policy.enabled) continue;
      if (policy.scope === 'global') applicable.push(policy);
      if (policy.scope === 'organization' && agent.organizationId) applicable.push(policy);
      if (policy.scope === 'agent') applicable.push(policy);
    }
    return applicable.sort((a, b) => b.priority - a.priority);
  }

  private async evaluateRule(rule: SafetyRule, task: AgentTaskDef, agent: AgentProfile): Promise<SafetyViolation> {
    switch (rule.type) {
      case 'tool_restriction': {
        const restrictedTools = rule.config.tools as string[] || [];
        const taskUsesRestrictedTool = task.requiredCapabilities.some(c => restrictedTools.includes(c));
        return {
          ruleId: rule.id,
          message: taskUsesRestrictedTool ? `Task uses restricted capabilities: ${task.requiredCapabilities.filter(c => restrictedTools.includes(c)).join(', ')}` : '',
          action: rule.action,
          violated: taskUsesRestrictedTool,
        };
      }

      case 'rate_limit': {
        const maxRequests = rule.config.maxRequestsPerMinute as number || 60;
        const recentRequests = this.auditLog.filter(e =>
          e.agentId === agent.id &&
          e.timestamp > Date.now() - 60000,
        ).length;
        return {
          ruleId: rule.id,
          message: recentRequests >= maxRequests ? `Rate limit exceeded: ${recentRequests}/${maxRequests} requests per minute` : '',
          action: rule.action,
          violated: recentRequests >= maxRequests,
        };
      }

      case 'content_moderation': {
        const blocked = rule.config.blockedCategories as string[] || [];
        const taskMentionsBlocked = blocked.some(cat =>
          task.description.toLowerCase().includes(cat),
        );
        return {
          ruleId: rule.id,
          message: taskMentionsBlocked ? `Task description may involve blocked content categories: ${blocked.filter(c => task.description.toLowerCase().includes(c)).join(', ')}` : '',
          action: rule.action,
          violated: taskMentionsBlocked,
        };
      }

      case 'approval_required': {
        const requiresApproval = task.estimatedComplexity >= (rule.config.complexityThreshold as number || 5);
        return {
          ruleId: rule.id,
          message: requiresApproval ? `Task requires human approval (complexity: ${task.estimatedComplexity})` : '',
          action: rule.action,
          violated: requiresApproval,
        };
      }

      default:
        return { ruleId: rule.id, message: '', action: 'allow', violated: false };
    }
  }

  private logAuditEntry(entry: AuditEntry): void {
    this.auditLog.push(entry);
    if (this.auditLog.length > 10000) this.auditLog.shift();
  }
}

interface AuditEntry {
  agentId: string;
  taskId: string;
  action: string;
  violations: SafetyViolation[];
  timestamp: number;
}

interface SafetyViolation {
  ruleId: string;
  message: string;
  action: 'allow' | 'deny' | 'flag' | 'escalate';
  violated: boolean;
}

export interface SafetyCheckResult {
  allowed: boolean;
  violations: SafetyViolation[];
}
