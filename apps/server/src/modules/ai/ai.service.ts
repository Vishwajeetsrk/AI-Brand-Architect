import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { ProviderFactory } from './providers/provider-factory';
import { GenerateOptions, StreamChunk } from './providers/llm-provider.interface';

@Injectable()
export class AiService {
  constructor(private readonly providerFactory: ProviderFactory) {}

  async generateText(model: string, prompt: string, options?: GenerateOptions): Promise<string> {
    const provider = this.providerFactory.getProvider(model);
    const result = await provider.generateText(prompt, { ...options, model });
    const userId = (options as any)?.userId || 'system';
    await prisma.prompt.create({
      data: { title: prompt.slice(0, 100), content: prompt, systemPrompt: options?.systemPrompt, model, userId },
    });
    await prisma.generation.create({
      data: {
        type: 'CONTENT',
        prompt,
        result: { text: result },
        provider: provider.constructor.name,
        model,
        tokensUsed: options?.maxTokens ?? null,
        userId,
      },
    });
    return result;
  }

  async generateStream(model: string, prompt: string, options?: GenerateOptions): Promise<AsyncGenerator<StreamChunk>> {
    const provider = this.providerFactory.getProvider(model);
    return provider.generateStream(prompt, { ...options, model });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const provider = this.providerFactory.getProvider('text-embedding-3-small');
    return provider.generateEmbedding(text);
  }
}
