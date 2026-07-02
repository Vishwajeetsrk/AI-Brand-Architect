import { SafetyDetector, SafetyCheckResult, SafetyDetectorConfig } from '../safety-types';

const BLOCKED_PATTERNS: { pattern: RegExp; category: 'hate_speech' | 'violence' | 'sexual' | 'harassment' | 'self_harm' | 'illegal'; severity: 'low' | 'medium' | 'high' | 'critical' }[] = [
  { pattern: /\b(kill|murder|torture|execute)\s+(yourself|someone|people|him|her|them)\b/i, severity: 'critical', category: 'violence' },
  { pattern: /\b(hate|racist|nazi|white\s*supremac)\w*/i, severity: 'high', category: 'hate_speech' },
  { pattern: /\b(terroris|bomb|explosive|mass\s+shoot)\w*/i, severity: 'critical', category: 'violence' },
  { pattern: /\b(child\s*(abuse|exploit|porn))\b/i, severity: 'critical', category: 'illegal' },
  { pattern: /\b(self[\s-]?(harm|hurt|injur|cut))\b/i, severity: 'high', category: 'self_harm' },
  { pattern: /\b(suicide|kill\s+(myself|yourself))\b/i, severity: 'critical', category: 'self_harm' },
  { pattern: /\b(dox|doxx|harass|stalk)\b/i, severity: 'high', category: 'harassment' },
  { pattern: /\b(sexual\s+(assault|abuse|content|explicit)|pornograph)\w*/i, severity: 'high', category: 'sexual' },
  { pattern: /\b(rape|incest|pedophil)\w*/i, severity: 'critical', category: 'sexual' },
  { pattern: /\b(drug\s+(traffick|deal|manufactur)|weapons?\s+(traffick|deal))\b/i, severity: 'high', category: 'illegal' },
  { pattern: /\b(how\s+to\s+(make|build|create)\s+(bomb|explosive|weapon|drug))\b/i, severity: 'critical', category: 'illegal' },
  { pattern: /\b(harass|bully|cyberbull)\w*/i, severity: 'medium', category: 'harassment' },
  { pattern: /\b(slur|discriminat)\w*/i, severity: 'high', category: 'hate_speech' },
  { pattern: /\b(explicit\s+(image|video|material|content))\b/i, severity: 'medium', category: 'sexual' },
];

export const contentModerationDetector: SafetyDetector = {
  name: 'content_moderation',

  check(input: string, config: SafetyDetectorConfig): SafetyCheckResult | null {
    if (!config.enabled || !input) return null;

    const blocked = new Set(config.blockedCategories || []);
    let highestSeverity = 'low' as 'low' | 'medium' | 'high' | 'critical';
    let matchedCategory = '' as any;
    let matchedContent = '';

    for (const { pattern, severity, category } of BLOCKED_PATTERNS) {
      if (blocked.size > 0 && !blocked.has(category)) continue;

      const match = input.match(pattern);
      if (match) {
        const severityLevel = { low: 0, medium: 1, high: 2, critical: 3 };
        if (severityLevel[severity] > severityLevel[highestSeverity]) {
          highestSeverity = severity;
          matchedCategory = category;
          matchedContent = match[0].substring(0, 100);
        }
      }
    }

    if (!matchedCategory) return null;

    const severityNum = { low: 0, medium: 1, high: 2, critical: 3 };
    if (severityNum[highestSeverity] >= severityNum[config.threshold as unknown as keyof typeof severityNum]) {
      const action = highestSeverity === 'critical' || highestSeverity === 'high' ? config.action : 'flag';
      return {
        allowed: action !== 'block',
        action,
        category: matchedCategory,
        severity: highestSeverity,
        detector: 'content_moderation',
        message: `Content moderation triggered: ${matchedCategory}`,
        matchedContent,
      };
    }

    return null;
  },

  checkOutput(input: string, output: string, config: SafetyDetectorConfig): SafetyCheckResult | null {
    return this.check(output, config);
  },
};
