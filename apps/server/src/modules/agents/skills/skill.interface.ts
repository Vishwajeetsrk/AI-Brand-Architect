export interface SkillInput {
  brandName?: string;
  brandDescription?: string;
  industry?: string;
  keywords?: string[];
  targetAudience?: string;
  additionalContext?: Record<string, any>;
}

export interface SkillOutput {
  results: Record<string, any>;
  summary: string;
}

export interface AgentSkill {
  readonly name: string;
  readonly description: string;
  execute(input: SkillInput): Promise<SkillOutput>;
}
