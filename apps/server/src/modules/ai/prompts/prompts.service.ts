import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AiService } from '../ai.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { GenerateContentDto } from './dto/generate-content.dto';

export interface Prompt {
  id: string;
  name: string;
  template: string;
  description: string | null;
  defaultModel: string | null;
  temperature: number | null;
  userId: string;
  createdAt: Date;
}

@Injectable()
export class PromptsService {
  private prompts: Prompt[] = [];

  constructor(private readonly aiService: AiService) {}

  create(dto: CreatePromptDto, userId: string): Prompt {
    const prompt: Prompt = {
      id: uuidv4(),
      name: dto.name,
      template: dto.template,
      description: dto.description || null,
      defaultModel: dto.defaultModel || null,
      temperature: dto.temperature ?? null,
      userId,
      createdAt: new Date(),
    };
    this.prompts.push(prompt);
    return prompt;
  }

  findAll(userId?: string): Prompt[] {
    let result = this.prompts;
    if (userId) result = result.filter((p) => p.userId === userId);
    return result;
  }

  findOne(id: string): Prompt {
    const prompt = this.prompts.find((p) => p.id === id);
    if (!prompt) {
      throw new NotFoundException(`Prompt with id ${id} not found`);
    }
    return prompt;
  }

  remove(id: string): void {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Prompt with id ${id} not found`);
    }
    this.prompts.splice(index, 1);
  }

  async executePrompt(promptId: string, dto: GenerateContentDto): Promise<string> {
    const prompt = this.findOne(promptId);
    const filledTemplate = prompt.template
      .replace(/\{\{brandName\}\}/g, dto.brandName)
      .replace(/\{\{brandDescription\}\}/g, dto.brandDescription);

    const variables = dto.variables || {};
    let finalPrompt = filledTemplate;
    for (const [key, value] of Object.entries(variables)) {
      finalPrompt = finalPrompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
    }

    const systemPrompt = `You are an AI brand architect assistant. Generate brand content based on the provided prompt.`;
    const model = dto.model || prompt.defaultModel || 'gpt-4o';

    return this.aiService.generateText(model, finalPrompt, {
      systemPrompt,
      temperature: prompt.temperature ?? 0.7,
    });
  }
}
