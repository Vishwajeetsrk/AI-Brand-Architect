import { SafetyDetector, SafetyCheckResult, SafetyDetectorConfig } from '../safety-types';

const UNSAFE_OUTPUT_PATTERNS: { pattern: RegExp; severity: 'low' | 'medium' | 'high' | 'critical'; label: string }[] = [
  { pattern: /\b(here'?s\s+(how|a\s+guide|step[-\s]by[-\s]step)\s+(to\s+)?(bomb|explosive|harm|kill|illegal))\b/i, severity: 'critical', label: 'harmful_instructions' },
  { pattern: /\b(I'?ll\s+(help|assist|provide|give)\s+you\s+with\s+(that\s+)?(illegal|harmful|dangerous))\b/i, severity: 'high', label: 'harmful_assistance' },
  { pattern: /\b(I\s+(understand|see|get\s+it)\s*,\s*(let\s+me|I\s+will|here\s+is)\s+(ignore|bypass|disregard))\b/i, severity: 'high', label: 'compliance_with_injection' },
  { pattern: /\b(system\s+(prompt|instruction|message)\s*[:\s])|(my\s+(instructions|rules)\s+are)\b/i, severity: 'medium', label: 'system_info_leak' },
  { pattern: /\b(API\s+key|secret\s+key|password\s*[:\s]+\S{8,}|token\s*[:\s]+\S{16,})\b/i, severity: 'high', label: 'credential_leak' },
];

const FORMAT_CHECK_MIN_LENGTH = 10;

export const outputGuardrailDetector: SafetyDetector = {
  name: 'output_guardrail',

  check(_input: string, _config: SafetyDetectorConfig): SafetyCheckResult | null {
    return null;
  },

  checkOutput(input: string, output: string, config: SafetyDetectorConfig): SafetyCheckResult | null {
    if (!config.enabled || !output) return null;

    let highestSeverity = 'low' as 'low' | 'medium' | 'high' | 'critical';
    let matchedLabel = '';
    let matchedContent = '';

    for (const { pattern, severity, label } of UNSAFE_OUTPUT_PATTERNS) {
      const match = output.match(pattern);
      if (match) {
        const severityLevel = { low: 0, medium: 1, high: 2, critical: 3 };
        if (severityLevel[severity] > severityLevel[highestSeverity]) {
          highestSeverity = severity;
          matchedLabel = label;
          matchedContent = match[0].substring(0, 100);
        }
      }
    }

    if (matchedLabel) {
      const severityNum = { low: 0, medium: 1, high: 2, critical: 3 };
      if (severityNum[highestSeverity] >= severityNum[config.threshold as unknown as keyof typeof severityNum]) {
        const action = highestSeverity === 'critical' || highestSeverity === 'high' ? config.action : 'flag';
        return {
          allowed: action !== 'block',
          action,
          category: 'unsafe_output',
          severity: highestSeverity,
          detector: 'output_guardrail',
          message: `Unsafe output detected: ${matchedLabel}`,
          matchedContent,
        };
      }
    }

    const inputWords = input.split(/\s+/).length;
    const outputWords = output.split(/\s+/).length;

    if (output.length > FORMAT_CHECK_MIN_LENGTH) {
      const ratio = outputWords / Math.max(inputWords, 1);
      if (ratio > 20 && inputWords > 3) {
        return {
          allowed: true,
          action: 'flag',
          category: 'format_violation',
          severity: 'low',
          detector: 'output_guardrail',
          message: `Output disproportionately large (${outputWords} vs ${inputWords} input words)`,
          matchedContent: `ratio: ${ratio.toFixed(1)}x`,
        };
      }
    }

    return null;
  },
};
