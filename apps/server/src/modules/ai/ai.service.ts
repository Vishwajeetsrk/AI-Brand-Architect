import { Injectable } from '@nestjs/common';
import { ProviderFactory } from './providers/provider-factory';
import { GenerateOptions, StreamChunk } from './providers/llm-provider.interface';

@Injectable()
export class AiService {
  constructor(private readonly providerFactory: ProviderFactory) {}

  async generateText(model: string, prompt: string, options?: GenerateOptions): Promise<string> {
    const provider = this.providerFactory.getProvider(model);
    return provider.generateText(prompt, { ...options, model });
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
