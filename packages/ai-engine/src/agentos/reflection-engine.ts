import { ReflectionResult, AgentTaskDef, EvaluationDimension, FeedbackRecord } from './agentos-types';

interface ReflectionOptions {
  minConfidenceThreshold: number;
  maxRetries: number;
}

const DEFAULT_DIMENSIONS = [
  { name: 'completeness', weight: 0.25 },
  { name: 'relevance', weight: 0.25 },
  { name: 'clarity', weight: 0.15 },
  { name: 'coherence', weight: 0.20 },
  { name: 'actionability', weight: 0.15 },
];

export class ReflectionEngine {
  private results: Map<string, ReflectionResult> = new Map();
  private feedbackHistory: FeedbackRecord[] = [];
  private calibrationHistory: number[] = [];
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
    const dimensions = this.scoreDimensions(task, output);

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
    const score = this.calculateScore(task, output, dimensions);
    const calibratedConfidence = this.calibrateConfidence(score);
    const passed = score >= this.options.minConfidenceThreshold && !hasError;

    if (hasError) issues.push('Output indicates execution error');

    if (score < 0.7) {
      improvements.push('Increase specificity and reduce ambiguity in output');
      improvements.push('Verify all constraints were addressed');
    }

    const result: ReflectionResult = {
      taskId: task.id,
      evaluation: { score, passed, issues, improvements, dimensions },
      confidence: calibratedConfidence,
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

  getAllResults(): ReflectionResult[] {
    return Array.from(this.results.values());
  }

  async batchEvaluate(tasks: { task: AgentTaskDef; output: string }[]): Promise<ReflectionResult[]> {
    const results: ReflectionResult[] = [];
    for (const { task, output } of tasks) {
      const result = await this.evaluate(task, output);
      results.push(result);
    }
    return results;
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

  recordFeedback(feedback: FeedbackRecord): void {
    this.feedbackHistory.push(feedback);
    this.calibrationHistory.push(Math.abs(feedback.predictedScore - feedback.actualScore));
    if (this.calibrationHistory.length > 100) {
      this.calibrationHistory.shift();
    }
  }

  getConfidenceCalibration(): { averageError: number; sampleSize: number; adjusted: boolean } {
    if (this.calibrationHistory.length === 0) {
      return { averageError: 0, sampleSize: 0, adjusted: false };
    }
    const avgError = this.calibrationHistory.reduce((a, b) => a + b, 0) / this.calibrationHistory.length;
    return { averageError: avgError, sampleSize: this.calibrationHistory.length, adjusted: avgError > 0.1 };
  }

  getFeedbackStats(): { total: number; avgCorrection: number; recentAccuracy: number } {
    if (this.feedbackHistory.length === 0) {
      return { total: 0, avgCorrection: 0, recentAccuracy: 1 };
    }
    const recent = this.feedbackHistory.slice(-20);
    const correct = recent.filter(f => !f.corrected).length;
    return {
      total: this.feedbackHistory.length,
      avgCorrection: this.feedbackHistory.filter(f => f.corrected).length / this.feedbackHistory.length,
      recentAccuracy: correct / recent.length,
    };
  }

  toPrismaData(result: ReflectionResult): Record<string, any> {
    return {
      taskId: result.taskId,
      score: result.evaluation.score,
      passed: result.evaluation.passed,
      issues: result.evaluation.issues,
      improvements: result.evaluation.improvements,
      confidence: result.confidence,
      needsRetry: result.needsRetry,
      retryCount: result.retryCount,
      suggestedChanges: result.suggestedChanges,
    };
  }

  private calibrateConfidence(rawScore: number): number {
    if (this.calibrationHistory.length < 5) return rawScore;
    const avgError = this.calibrationHistory.reduce((a, b) => a + b, 0) / this.calibrationHistory.length;
    const adjustment = Math.min(avgError, 0.2);
    return Math.max(0, Math.min(1, rawScore - adjustment));
  }

  private scoreDimensions(task: AgentTaskDef, output: string): EvaluationDimension[] {
    return DEFAULT_DIMENSIONS.map(dim => {
      let score: number;
      switch (dim.name) {
        case 'completeness':
          score = this.scoreCompleteness(task, output);
          break;
        case 'relevance':
          score = this.scoreRelevance(task, output);
          break;
        case 'clarity':
          score = this.scoreClarity(output);
          break;
        case 'coherence':
          score = this.scoreCoherence(output);
          break;
        case 'actionability':
          score = this.scoreActionability(output);
          break;
        default:
          score = 0.5;
      }
      return { ...dim, score };
    });
  }

  private calculateScore(task: AgentTaskDef, output: string, dimensions: EvaluationDimension[]): number {
    const weightedScore = dimensions.reduce((sum, d) => sum + d.score * d.weight, 0);
    let penalty = 0;

    if (!output || output.trim().length === 0) penalty += 0.3;
    if (task.retryCount > 0) penalty += task.retryCount * 0.08;
    if (output.toLowerCase().includes('error') || output.toLowerCase().includes('failed')) penalty += 0.15;

    return Math.max(0, Math.min(1, weightedScore - penalty));
  }

  private scoreCompleteness(task: AgentTaskDef, output: string): number {
    if (!output) return 0;
    const words = output.split(/\s+/).length;
    const hasIntro = /^(introduction?|overview|summary|here['´´]s|this\s+(guide|analysis|report|document))/i.test(output.trim());
    const hasConclusion = /(conclusion|summary|in\s+(summary|conclusion)|to\s+(sum\s+up|conclude)|finally)/i.test(output);
    let score = 0.3;
    if (words > 30) score += 0.2;
    if (words > 100) score += 0.15;
    if (words > 300) score += 0.1;
    if (hasIntro) score += 0.15;
    if (hasConclusion) score += 0.1;
    return Math.min(1, score);
  }

  private scoreRelevance(task: AgentTaskDef, output: string): number {
    const taskWords = task.description.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (taskWords.length === 0) return 0.5;
    const outputLower = output.toLowerCase();
    const matched = taskWords.filter(w => outputLower.includes(w));
    const ratio = matched.length / taskWords.length;
    return Math.min(1, 0.3 + ratio * 0.7);
  }

  private scoreClarity(output: string): number {
    if (!output || output.length < 10) return 0.2;
    const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0.3;
    const avgWordsPerSentence = sentences.reduce((sum, s) => sum + s.split(/\s+/).filter(Boolean).length, 0) / sentences.length;
    const hasLists = /[•\-*\d+\.]\s/.test(output);
    const hasHeaders = /#{1,3}\s|^[A-Z][^.]*:(\s|$)/m.test(output);
    let score = 0.4;
    if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 25) score += 0.2;
    else if (avgWordsPerSentence < 5) score -= 0.1;
    if (hasLists) score += 0.2;
    if (hasHeaders) score += 0.2;
    return Math.min(1, score);
  }

  private scoreCoherence(output: string): number {
    if (!output || output.length < 20) return 0.3;
    const transitions = ['therefore', 'however', 'furthermore', 'moreover', 'consequently', 'additionally', 'in addition', 'for example', 'specifically', 'as a result', 'on the other hand', 'in contrast', 'first', 'second', 'third', 'finally', 'next', 'then', 'meanwhile'];
    const outputLower = output.toLowerCase();
    const foundTransitions = transitions.filter(t => outputLower.includes(t)).length;
    const paraBreaks = (output.match(/\n\n+/g) || []).length;
    let score = 0.3;
    score += Math.min(0.3, foundTransitions * 0.05);
    if (paraBreaks >= 2) score += 0.2;
    if (paraBreaks >= 5) score += 0.1;
    const sentences = output.split(/[.!?]+\s+/).filter(s => s.trim().length > 3);
    if (sentences.length >= 3) score += 0.1;
    return Math.min(1, score);
  }

  private scoreActionability(output: string): number {
    if (!output) return 0.2;
    const actionWords = ['implement', 'create', 'build', 'develop', 'use', 'apply', 'follow', 'start', 'begin', 'try', 'test', 'deploy', 'launch', 'optimize', 'improve', 'reduce', 'increase', 'ensure', 'configure', 'set up', 'migrate', 'integrate', 'adopt', 'establish'];
    const outputLower = output.toLowerCase();
    const foundActions = actionWords.filter(w => outputLower.includes(w)).length;
    const hasSteps = /(step\s+\d+|^\d+\.\s|instructions?:|steps?:)/mi.test(output);
    const hasActionable = /(you\s+(can|should|need\s+to|must|will)|recommend|suggest|best\s+practice)/i.test(output);
    let score = 0.2;
    score += Math.min(0.3, foundActions * 0.03);
    if (hasSteps) score += 0.25;
    if (hasActionable) score += 0.25;
    return Math.min(1, score);
  }
}
