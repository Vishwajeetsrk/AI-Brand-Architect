import { Injectable } from '@nestjs/common';
import { LLMProvider } from './llm-provider.interface';
import { OpenAIProvider } from './openai.provider';
import { AnthropicProvider } from './anthropic.provider';

@Injectable()
export class ProviderFactory {
  constructor(
    private readonly openAIProvider: OpenAIProvider,
    private readonly anthropicProvider: AnthropicProvider,
  ) {}

  getProvider(model?: string): LLMProvider {
    if (!model) return this.openAIProvider;

    const modelLower = model.toLowerCase();
    if (modelLower.includes('gpt') || modelLower.includes('text-embedding') || modelLower.includes('o1') || modelLower.includes('o3')) {
      return this.openAIProvider;
    }
    if (modelLower.includes('claude')) {
      return this.anthropicProvider;
    }

    return this.openAIProvider;
  }
}
