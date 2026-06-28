import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ReflectionService } from '../reflection/reflection.service';
import { AgentSkill, SkillInput } from './skills/skill.interface';
import { BrandAnalysisSkill } from './skills/brand-analysis.skill';
import { ContentGenerationSkill } from './skills/content-generation.skill';
import { ExecuteAgentDto } from './dto/execute-agent.dto';
import { AgentResponseDto, AgentSkillResult } from './dto/agent-response.dto';

export interface AgentConfig {
  id: string;
  name: string;
  agentType: string;
  description: string;
  skills: string[];
  model: string;
  temperature: number;
}

@Injectable()
export class AgentRuntime {
  private skillRegistry: Map<string, AgentSkill> = new Map();

  constructor(
    private readonly aiService: AiService,
    private readonly reflectionService: ReflectionService,
    private readonly brandAnalysisSkill: BrandAnalysisSkill,
    private readonly contentGenerationSkill: ContentGenerationSkill,
  ) {
    this.registerSkill(brandAnalysisSkill);
    this.registerSkill(contentGenerationSkill);
  }

  registerSkill(skill: AgentSkill): void {
    this.skillRegistry.set(skill.name, skill);
  }

  async execute(agent: AgentConfig, input: ExecuteAgentDto): Promise<AgentResponseDto> {
    const startTime = Date.now();
    const skillResults: AgentSkillResult[] = [];
    let combinedContext = '';

    const skillInput: SkillInput = {
      brandName: input.context?.brandName as string,
      brandDescription: input.context?.brandDescription as string,
      industry: input.context?.industry as string,
      keywords: input.context?.keywords as string[],
      targetAudience: input.context?.targetAudience as string,
      additionalContext: input.context,
    };

    for (const skillName of agent.skills) {
      const skill = this.skillRegistry.get(skillName);
      if (!skill) continue;

      const skillStart = Date.now();
      try {
        const output = await skill.execute(skillInput);
        const executionTimeMs = Date.now() - skillStart;
        skillResults.push({ skillName, output: output.results, executionTimeMs });
        combinedContext += `\n[${skillName} output]\n${output.summary}\n`;
      } catch (err) {
        skillResults.push({
          skillName,
          output: { error: (err as Error).message },
          executionTimeMs: Date.now() - skillStart,
        });
      }
    }

    const systemPrompt = `You are an AI brand architect agent named "${agent.name}". You have access to the following skills and their outputs:\n${combinedContext}\nUse this context to generate a comprehensive response. Be insightful and actionable.`;

    const output = await this.aiService.generateText(agent.model, input.input, {
      systemPrompt,
      temperature: agent.temperature,
    });

    const executionTimeMs = Date.now() - startTime;

    let reflection = null;
    try {
      reflection = await this.reflectionService.evaluate(
        `${agent.id}-${Date.now()}`,
        input.input,
        output,
        0,
        agent.skills,
      );
    } catch {
      // reflection is best-effort
    }

    return {
      agentId: agent.id,
      agentName: agent.name,
      input: input.input,
      output,
      skillResults,
      executionTimeMs,
      model: agent.model,
      reflection,
    };
  }
}
