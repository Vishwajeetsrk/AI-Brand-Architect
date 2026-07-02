import { LLMMessage, LLMResponse, LLMProviderType } from '../types';
import { getProvider } from '../llm/provider-factory';

interface BatchedRequest {
  id: string;
  messages: LLMMessage[];
  model: string;
  provider: LLMProviderType;
  temperature?: number;
  maxTokens?: number;
  resolve: (response: LLMResponse) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

export interface BatchConfig {
  batchWindow: number;
  maxBatchSize: number;
  enabled: boolean;
}

const DEFAULT_CONFIG: BatchConfig = {
  batchWindow: 50,
  maxBatchSize: 10,
  enabled: true,
};

export class RequestBatcher {
  private queue: Map<string, BatchedRequest[]> = new Map();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private config: BatchConfig;

  constructor(config?: Partial<BatchConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async enqueue(
    messages: LLMMessage[],
    model: string,
    provider: LLMProviderType,
    apiKey?: string,
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<LLMResponse> {
    if (!this.config.enabled) {
      const providerInstance = getProvider(provider, apiKey);
      return providerInstance.generateText(messages, { model, ...options });
    }

    return new Promise<LLMResponse>((resolve, reject) => {
      const key = this.batchKey(provider, model);

      if (!this.queue.has(key)) {
        this.queue.set(key, []);
      }

      const requests = this.queue.get(key)!;
      requests.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        messages,
        model,
        provider,
        temperature: options?.temperature,
        maxTokens: options?.maxTokens,
        resolve,
        reject,
        timestamp: Date.now(),
      });

      if (requests.length >= this.config.maxBatchSize) {
        this.flush(key);
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flushAll(), this.config.batchWindow);
      }
    });
  }

  updateConfig(config: Partial<BatchConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): BatchConfig {
    return { ...this.config };
  }

  getQueueSize(): number {
    let total = 0;
    for (const [, requests] of this.queue) {
      total += requests.length;
    }
    return total;
  }

  flushAll(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    for (const key of this.queue.keys()) {
      this.flush(key);
    }
  }

  private batchKey(provider: LLMProviderType, model: string): string {
    return `${provider}:${model}`;
  }

  private async flush(key: string): Promise<void> {
    const requests = this.queue.get(key);
    if (!requests || requests.length === 0) return;

    this.queue.delete(key);

    const [provider, model] = key.split(':') as [LLMProviderType, string];
    const apiKey = this.resolveApiKey(provider);

    for (const req of requests) {
      try {
        const providerInstance = getProvider(req.provider, apiKey);
        const response = await providerInstance.generateText(req.messages, {
          model: req.model,
          temperature: req.temperature,
          maxTokens: req.maxTokens,
        });
        req.resolve(response);
      } catch (err) {
        req.reject(err as Error);
      }
    }

    if (this.timer && this.queue.size === 0) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private resolveApiKey(provider: LLMProviderType): string | undefined {
    const envMap: Record<string, string | undefined> = {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      google: process.env.GOOGLE_AI_API_KEY,
      deepseek: process.env.DEEPSEEK_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY,
      groq: process.env.GROQ_API_KEY,
      cohere: process.env.COHERE_API_KEY,
      xai: process.env.XAI_API_KEY,
      huggingface: process.env.HUGGINGFACE_API_KEY,
      azure: process.env.AZURE_OPENAI_KEY,
    };
    return envMap[provider];
  }
}
