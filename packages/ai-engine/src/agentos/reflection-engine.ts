import { ReflectionResult, AgentTaskDef } from './agentos-types';

interface ReflectionOptions {
  minConfidenceThreshold: number;
  maxRetries: number;
}

export class ReflectionEngine {
  private results: Map<string, ReflectionResult> = new Map();
  private options: ReflectionOptions;

  constructor(options?: Partial<ReflectionOptions>) {
    this.options = {
      minConfidenceThreshold: options?.minConfidenceThreshold ?? 0.6,
      maxRetries: options?.maxRetries ?? 3,
    };
  }

  async evaluate(task: AgentTaskDef, output: string): Promise<ReflectionResult> {
    const issues: string[] = [];
    const improvements: string[] = [];

    if (!output || output.trim().length === 0) {
      issues.push('Empty output produced');
    }

    if (task.description.toLowerCase().includes('error') && output.toLowerCase().includes('error')) {
      issues.push('Output contains error references for a success task');
    }

    if (output.length < 20) {
      issues.push('Output is too brief — may lack depth');
      improvements.push('Expand the output with more detail and supporting evidence');
    }

    if (task.retryCount > 0) {
      improvements.push('Consider a different approach since previous attempts failed');
    }

    const hasError = output.toLowerCase().includes('error') || output.toLowerCase().includes('failed') || output.toLowerCase().includes('unable');
    const score = this.calculateScore(task, output, issues.length);
    const passed = score >= this.options.minConfidenceThreshold && !hasError;

    if (hasError) issues.push('Output indicates execution error');

    if (score < 0.7) {
      improvements.push('Increase specificity and reduce ambiguity in output');
      improvements.push('Verify all constraints were addressed');
    }

    const result: ReflectionResult = {
      taskId: task.id,
      evaluation: { score, passed, issues, improvements },
      confidence: score,
      needsRetry: !passed && task.retryCount < this.options.maxRetries,
      retryCount: task.retryCount,
      suggestedChanges: improvements.length > 0 ? improvements.join('; ') : undefined,
      timestamp: Date.now(),
    };

    this.results.set(task.id, result);
    return result;
  }

  getResult(taskId: string): ReflectionResult | undefined {
    return this.results.get(taskId);
  }

  async suggestAlternative(task: AgentTaskDef, previousError?: string): Promise<string> {
    const alternatives: string[] = [];

    if (previousError) {
      alternatives.push(`Previous approach failed: ${previousError}. Try a different methodology.`);
    }

    if (task.retryCount > 1) {
      alternatives.push('Consider breaking this task into smaller subtasks');
      alternatives.push('Try using a different tool or capability');
    }

    if (task.requiredCapabilities.some(c => c.includes('research') || c.includes('search'))) {
      alternatives.push('Broaden the search scope or try different keywords');
    }

    if (task.requiredCapabilities.some(c => c.includes('generate') || c.includes('create'))) {
      alternatives.push('Use a more creative or structured approach to generation');
      alternatives.push('Leverage existing templates or examples as reference');
    }

    return alternatives.join('\n') || 'Retry the task with more specific instructions';
  }

  private calculateScore(task: AgentTaskDef, output: string, issueCount: number): number {
    let score = 1.0;

    score -= issueCount * 0.15;

    if (task.retryCount > 0) score -= task.retryCount * 0.1;

    if (output.length < 50) score -= 0.2;
    else if (output.length > 1000) score += 0.1;

    const taskKeywords = task.description.toLowerCase().split(/\s+/);
    const outputKeywords = output.toLowerCase().split(/\s+/);
    const overlap = taskKeywords.filter(k => outputKeywords.includes(k)).length;
    const relevanceRatio = overlap / Math.max(taskKeywords.length, 1);
    if (relevanceRatio < 0.2) score -= 0.2;

    return Math.max(0, Math.min(1, score));
  }
}
