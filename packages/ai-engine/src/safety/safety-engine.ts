import {
  SafetyEngineConfig,
  SafetyCheckResult,
  SafetyDetectorConfig,
  SafetyEventRecord,
  SafetyDetector,
} from './safety-types';
import { promptInjectionDetector } from './detectors/prompt-injection';
import { contentModerationDetector } from './detectors/content-moderation';
import { piiDetector } from './detectors/pii-detector';
import { outputGuardrailDetector } from './detectors/output-guardrail';

const DEFAULT_CONFIG: SafetyEngineConfig = {
  enabled: true,
  mode: 'moderate',
  detectors: {
    prompt_injection: { enabled: true, threshold: 1, action: 'block', blockedCategories: ['prompt_injection', 'jailbreak'] },
    content_moderation: { enabled: true, threshold: 2, action: 'block', blockedCategories: ['hate_speech', 'violence', 'sexual', 'harassment', 'self_harm', 'illegal'] },
    pii_detector: { enabled: true, threshold: 2, action: 'flag', blockedCategories: ['pii_email', 'pii_phone', 'pii_ssn', 'pii_credit_card', 'pii_api_key'] },
    output_guardrail: { enabled: true, threshold: 2, action: 'flag' },
  },
};

const MODE_OVERRIDES: Record<string, Partial<SafetyEngineConfig>> = {
  strict: {
    detectors: {
      prompt_injection: { enabled: true, threshold: 0, action: 'block' },
      content_moderation: { enabled: true, threshold: 0, action: 'block' },
      pii_detector: { enabled: true, threshold: 0, action: 'block' },
      output_guardrail: { enabled: true, threshold: 0, action: 'block' },
    },
  },
  relaxed: {
    detectors: {
      prompt_injection: { enabled: true, threshold: 3, action: 'flag' },
      content_moderation: { enabled: true, threshold: 3, action: 'flag' },
      pii_detector: { enabled: false, threshold: 3, action: 'flag' },
      output_guardrail: { enabled: true, threshold: 3, action: 'flag' },
    },
  },
};

export class SafetyEngine {
  private config: SafetyEngineConfig;
  private detectors: Map<string, SafetyDetector> = new Map();
  private eventCallback?: (event: SafetyEventRecord) => void;
  private checkCount = 0;
  private blockCount = 0;
  private flagCount = 0;

  constructor(config?: Partial<SafetyEngineConfig>) {
    this.config = this.mergeConfig(config);
    this.registerDefaultDetectors();
  }

  private mergeConfig(override?: Partial<SafetyEngineConfig>): SafetyEngineConfig {
    const base = JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as SafetyEngineConfig;

    if (!override) return base;

    if (override.enabled !== undefined) base.enabled = override.enabled;
    if (override.mode) {
      base.mode = override.mode;
      const modeCfg = MODE_OVERRIDES[override.mode];
      if (modeCfg?.detectors) {
        for (const [key, val] of Object.entries(modeCfg.detectors)) {
          if (base.detectors[key]) {
            Object.assign(base.detectors[key], val);
          }
        }
      }
    }
    if (override.detectors) {
      for (const [key, val] of Object.entries(override.detectors)) {
        if (base.detectors[key]) {
          Object.assign(base.detectors[key], val);
        }
      }
    }

    return base;
  }

  private registerDefaultDetectors(): void {
    this.registerDetector(promptInjectionDetector);
    this.registerDetector(contentModerationDetector);
    this.registerDetector(piiDetector);
    this.registerDetector(outputGuardrailDetector);
  }

  registerDetector(detector: SafetyDetector): void {
    this.detectors.set(detector.name, detector);
  }

  onEvent(callback: (event: SafetyEventRecord) => void): void {
    this.eventCallback = callback;
  }

  getConfig(): SafetyEngineConfig {
    return this.config;
  }

  updateConfig(update: Partial<SafetyEngineConfig>): void {
    this.config = this.mergeConfig({ ...this.config, ...update });
  }

  getStats(): { checkCount: number; blockCount: number; flagCount: number } {
    return { checkCount: this.checkCount, blockCount: this.blockCount, flagCount: this.flagCount };
  }

  checkInput(input: string, context?: { userId?: string; agentId?: string; modelId?: string }): SafetyCheckResult[] {
    if (!this.config.enabled) return [];
    this.checkCount++;

    const results: SafetyCheckResult[] = [];

    for (const [name, detector] of this.detectors) {
      const detectorConfig: SafetyDetectorConfig = this.config.detectors[name] || { enabled: false, threshold: 0, action: 'allow' };
      if (!detectorConfig.enabled) continue;

      try {
        const result = detector.check(input, detectorConfig);
        if (result && !result.allowed) {
          this.blockCount++;
          this.emitEvent(result, input, undefined, context);
        } else if (result && result.action === 'flag') {
          this.flagCount++;
          this.emitEvent(result, input, undefined, context);
        }
        if (result) results.push(result);
      } catch {
        results.push({
          allowed: true,
          action: 'allow',
          category: 'custom',
          severity: 'low',
          detector: name,
          message: `Detector ${name} threw error`,
        });
      }
    }

    return results;
  }

  checkOutput(input: string, output: string, context?: { userId?: string; agentId?: string; modelId?: string }): SafetyCheckResult[] {
    if (!this.config.enabled) return [];
    this.checkCount++;

    const results: SafetyCheckResult[] = [];

    for (const [name, detector] of this.detectors) {
      const detectorConfig = this.config.detectors[name] || { enabled: false, threshold: 0, action: 'allow' };
      if (!detectorConfig.enabled || !detector.checkOutput) continue;

      try {
        const result = detector.checkOutput(input, output, detectorConfig);
        if (result && !result.allowed) {
          this.blockCount++;
          this.emitEvent(result, input, output, context);
        } else if (result && result.action === 'flag') {
          this.flagCount++;
          this.emitEvent(result, input, output, context);
        }
        if (result) results.push(result);
      } catch {
        results.push({
          allowed: true,
          action: 'allow',
          category: 'custom',
          severity: 'low',
          detector: name,
          message: `Detector ${name} threw error on output`,
        });
      }
    }

    return results;
  }

  private emitEvent(result: SafetyCheckResult, input: string, output?: string, context?: { userId?: string; agentId?: string; modelId?: string }): void {
    if (!this.eventCallback) return;
    this.eventCallback({
      type: result.category,
      severity: result.severity,
      input: input?.substring(0, 1000),
      output: output?.substring(0, 1000),
      category: result.category,
      detectedBy: result.detector,
      action: result.action,
      userId: context?.userId,
      agentId: context?.agentId,
      modelId: context?.modelId,
    });
  }

  checkAll(allowed: SafetyCheckResult[]): boolean {
    return allowed.every(r => r.allowed);
  }
}
