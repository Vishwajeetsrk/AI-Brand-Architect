import { SafetyDetector, SafetyCheckResult, SafetyDetectorConfig, SafetyCategory } from '../safety-types';

const PII_PATTERNS: { pattern: RegExp; category: SafetyCategory; severity: 'low' | 'medium' | 'high' | 'critical'; label: string }[] = [
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, severity: 'low', category: 'pii_email', label: 'email_address' },
  { pattern: /\b\+?1?\d{10,15}\b/g, severity: 'low', category: 'pii_phone', label: 'phone_number' },
  { pattern: /\b\d{3}-?\d{2}-?\d{4}\b/g, severity: 'high', category: 'pii_ssn', label: 'ssn' },
  { pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, severity: 'high', category: 'pii_credit_card', label: 'credit_card' },
  { pattern: /\b(?:[A-Za-z0-9+/]{40}|[A-Za-z0-9_-]{32,})\b/g, severity: 'medium', category: 'pii_api_key', label: 'api_key_candidate' },
  { pattern: /\bsk-[A-Za-z0-9]{20,}\b/g, severity: 'critical', category: 'pii_api_key', label: 'openai_api_key' },
  { pattern: /\bgh[ps]_[A-Za-z0-9]{36}\b/g, severity: 'critical', category: 'pii_api_key', label: 'github_token' },
  { pattern: /\bAKIA[0-9A-Z]{16}\b/g, severity: 'critical', category: 'pii_api_key', label: 'aws_access_key' },
];

export const piiDetector: SafetyDetector = {
  name: 'pii_detector',

  check(input: string, config: SafetyDetectorConfig): SafetyCheckResult | null {
    if (!config.enabled || !input) return null;

    const blocked = new Set(config.blockedCategories || []);
    let highestSeverity = 'low' as 'low' | 'medium' | 'high' | 'critical';
    let matchedCategory: SafetyCategory = 'pii_custom';
    let matchedContent = '';
    let totalMatches = 0;

    for (const { pattern, severity, category, label } of PII_PATTERNS) {
      if (blocked.size > 0 && !blocked.has(category)) continue;

      const matches = [...input.matchAll(pattern)];
      if (matches.length > 0) {
        const severityLevel = { low: 0, medium: 1, high: 2, critical: 3 };
        totalMatches += matches.length;
        if (severityLevel[severity] > severityLevel[highestSeverity]) {
          highestSeverity = severity;
          matchedCategory = category;
          matchedContent = `${label} ×${matches.length}`;
        }
      }
    }

    if (totalMatches === 0) return null;

    const severityNum = { low: 0, medium: 1, high: 2, critical: 3 };
    if (severityNum[highestSeverity] >= severityNum[config.threshold as unknown as keyof typeof severityNum]) {
      const action = highestSeverity === 'critical' || highestSeverity === 'high' ? config.action : 'flag';
      return {
        allowed: action !== 'block',
        action,
        category: matchedCategory,
        severity: highestSeverity,
        detector: 'pii_detector',
        message: `PII detected: ${matchedContent}`,
        matchedContent,
      };
    }

    return null;
  },

  checkOutput(input: string, output: string, config: SafetyDetectorConfig): SafetyCheckResult | null {
    return this.check(output, config);
  },
};
