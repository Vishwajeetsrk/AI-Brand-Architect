export type SafetySeverity = 'low' | 'medium' | 'high' | 'critical';
export type SafetyAction = 'block' | 'flag' | 'allow';
export type SafetyCategory =
  | 'prompt_injection'
  | 'jailbreak'
  | 'hate_speech'
  | 'violence'
  | 'sexual'
  | 'harassment'
  | 'self_harm'
  | 'illegal'
  | 'pii_email'
  | 'pii_phone'
  | 'pii_ssn'
  | 'pii_credit_card'
  | 'pii_api_key'
  | 'pii_custom'
  | 'unsafe_output'
  | 'format_violation'
  | 'custom';

export interface SafetyCheckResult {
  allowed: boolean;
  action: SafetyAction;
  category: SafetyCategory;
  severity: SafetySeverity;
  detector: string;
  message: string;
  matchedContent?: string;
  ruleId?: string;
}

export interface SafetyDetectorConfig {
  enabled: boolean;
  threshold: number;
  action: SafetyAction;
  blockedCategories?: SafetyCategory[];
  customPatterns?: string[];
}

export interface SafetyEngineConfig {
  enabled: boolean;
  mode: 'strict' | 'moderate' | 'relaxed';
  detectors: Record<string, SafetyDetectorConfig>;
}

export interface SafetyEventRecord {
  type: SafetyCategory;
  severity: SafetySeverity;
  input?: string;
  output?: string;
  category: string;
  detectedBy: string;
  action: SafetyAction;
  modelId?: string;
  userId?: string;
  agentId?: string;
  metadata?: Record<string, unknown>;
}

export interface SafetyDetector {
  name: string;
  check(input: string, config: SafetyDetectorConfig): SafetyCheckResult | null;
  checkOutput?(input: string, output: string, config: SafetyDetectorConfig): SafetyCheckResult | null;
}
