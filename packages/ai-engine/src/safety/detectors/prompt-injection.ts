import { SafetyDetector, SafetyCheckResult, SafetyDetectorConfig } from '../safety-types';

const INJECTION_PATTERNS: { pattern: RegExp; severity: 'low' | 'medium' | 'high' | 'critical'; label: string }[] = [
  { pattern: /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directions|commands|prompts)/i, severity: 'high', label: 'ignore_previous_instructions' },
  { pattern: /forget\s+(all\s+)?(previous|prior|above)/i, severity: 'high', label: 'forget_previous' },
  { pattern: /disregard\s+(all\s+)?(previous|prior|above)/i, severity: 'high', label: 'disregard_instructions' },
  { pattern: /you\s+(are\s+)?(now|must\s+act\s+as|are\s+free|don'?t\s+need\s+to\s+follow)/i, severity: 'high', label: 'role_escape' },
  { pattern: /new\s+(instructions|rules|commands?)\s*[:：]/i, severity: 'medium', label: 'new_instructions' },
  { pattern: /override\s+(mode|system|settings|config)/i, severity: 'high', label: 'override_attempt' },
  { pattern: /output\s+(raw\s+)?(json|text|data)\s+(without|bypassing|ignoring)/i, severity: 'medium', label: 'output_bypass' },
  { pattern: /your\s+(response|answer|reply)\s+(must|should|will)\s+(contain|include|start\s+with)/i, severity: 'low', label: 'output_control' },
  { pattern: /actually\s+,\s*(scratch|forget|ignore|disregard)/i, severity: 'high', label: 'retraction_attack' },
  { pattern: /pretend|just\s+(pretend|imagine|suppose|act\s+as)/i, severity: 'low', label: 'pretend_attempt' },
  { pattern: /DAN|do\s+anything\s+now|jail\s*break|jailbroken/i, severity: 'critical', label: 'jailbreak_keyword' },
  { pattern: /you\s+(have\s+)?no\s+(rules|restrictions|limits|boundaries|constraints)/i, severity: 'high', label: 'no_limits' },
  { pattern: /(system|admin|root)\s+(prompt|instruction|command|message)/i, severity: 'medium', label: 'system_prompt_reference' },
  { pattern: /bypass|circumvent|evade|work\s*around/i, severity: 'high', label: 'bypass_attempt' },
  { pattern: /reveal|expose|leak|dump\s+(your|the)\s+(system|prompt|instructions?|rules?)/i, severity: 'high', label: 'prompt_leak_attempt' },
  { pattern: /(repeat|say|print|copy)\s+(the\s+)?(words?\s+)?(above|below|this|after)/i, severity: 'medium', label: 'copy_attempt' },
  { pattern: /you\s+(are\s+)?(being\s+)?(hacked|attacked|compromised)/i, severity: 'critical', label: 'social_engineering' },
  { pattern: /\[system\]|\[admin\]|\[instruction\]|\[user\s*:\s*system\]/i, severity: 'high', label: 'role_spoofing' },
  { pattern: /token\s*(smuggl|steal|hijack|inject)/i, severity: 'high', label: 'token_attack' },
];

const SEPARATOR_BYPASS = /(?:\|{3,}|={3,}|-{3,}|_{3,}|`{3,})[\s\S]*?(?:\|{3,}|={3,}|-{3,}|_{3,}|`{3,})/g;

export const promptInjectionDetector: SafetyDetector = {
  name: 'prompt_injection',

  check(input: string, config: SafetyDetectorConfig): SafetyCheckResult | null {
    if (!config.enabled || !input) return null;

    const blocked = new Set(config.blockedCategories || []);
    const hasBlockedInjection = blocked.has('prompt_injection') || blocked.has('jailbreak');

    let highestSeverity = 'low' as 'low' | 'medium' | 'high' | 'critical';
    let matchedLabel = '';
    let matchedContent = '';

    for (const { pattern, severity, label } of INJECTION_PATTERNS) {
      const match = input.match(pattern);
      if (match) {
        const severityLevel = { low: 0, medium: 1, high: 2, critical: 3 };
        if (severityLevel[severity] > severityLevel[highestSeverity]) {
          highestSeverity = severity;
          matchedLabel = label;
          matchedContent = match[0].substring(0, 100);
        }
      }
    }

    const sepMatch = input.match(SEPARATOR_BYPASS);
    if (sepMatch && sepMatch.length > 0) {
      const innerContent = sepMatch.map(m => m.replace(/[|=_`-]{3,}/g, '').trim()).filter(Boolean);
      if (innerContent.some(c => c.length > 50)) {
        const severityLevel = { low: 0, medium: 1, high: 2, critical: 3 };
        if (severityLevel.high > severityLevel[highestSeverity]) {
          highestSeverity = 'high';
          matchedLabel = 'separator_bypass';
          matchedContent = innerContent[0].substring(0, 100);
        }
      }
    }

    if (!matchedLabel) return null;

    const severityNum = { low: 0, medium: 1, high: 2, critical: 3 };

    if (hasBlockedInjection || severityNum[highestSeverity] >= severityNum[config.threshold as unknown as keyof typeof severityNum]) {
      const action = highestSeverity === 'critical' || highestSeverity === 'high' ? config.action : 'flag';
      return {
        allowed: action !== 'block',
        action,
        category: matchedLabel === 'jailbreak_keyword' ? 'jailbreak' : 'prompt_injection',
        severity: highestSeverity,
        detector: 'prompt_injection',
        message: `Prompt injection detected: ${matchedLabel}`,
        matchedContent,
      };
    }

    return null;
  },
};
