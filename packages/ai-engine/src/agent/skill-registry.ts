import { Skill, AgentContext } from '../types';
import { BrandAnalysisSkill } from './skills/brand-analysis';
import { ContentGenerationSkill } from './skills/content-generation';
import { MarketResearchSkill } from './skills/market-research';

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  constructor() {
    this.register(new BrandAnalysisSkill());
    this.register(new ContentGenerationSkill());
    this.register(new MarketResearchSkill());
  }

  register(skill: Skill): void {
    this.skills.set(skill.name, skill);
  }

  get(name: string): Skill | undefined {
    return this.skills.get(name);
  }

  getAll(): Skill[] {
    return Array.from(this.skills.values());
  }

  async execute(name: string, input: Record<string, unknown>, context: AgentContext): Promise<Record<string, unknown>> {
    const skill = this.skills.get(name);
    if (!skill) throw new Error(`Skill not found: ${name}`);
    return skill.execute(input, context);
  }

  getSkillsByNames(names: string[]): Skill[] {
    return names.map(n => this.skills.get(n)).filter(Boolean) as Skill[];
  }
}
