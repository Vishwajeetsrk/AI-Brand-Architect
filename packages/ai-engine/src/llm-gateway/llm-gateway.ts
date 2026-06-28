import { LLMMessage, LLMResponse, LLMProviderType, RoutingPreference, GenerateOptions } from '../types';
import { getProvider } from '../llm/provider-factory';
import { ModelRegistry } from './model-registry';
import { ModelRouter } from './model-router';
import { CostTracker } from './cost-tracker';
import { AiMonitoringService } from '../monitoring/monitoring-service';
import { AiExecutionRecord } from '../monitoring/monitoring-types';

export class LLMGateway {
  public registry: ModelRegistry;
  public router: ModelRouter;
  public costTracker: CostTracker;
  public monitoring?: AiMonitoringService;
  private rateLimits: Map<string, { count: number; resetAt: number }> = new Map();

  constructor(options?: { monitoring?: AiMonitoringService }) {
    this.registry = new ModelRegistry();
    this.router = new ModelRouter(this.registry);
    this.costTracker = new CostTracker();
    this.monitoring = options?.monitoring;
  }

  async generate(messages: LLMMessage[], options?: {
    model?: string;
    provider?: LLMProviderType;
    preference?: RoutingPreference;
    userId?: string;
    tags?: string[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    const { model: modelId, provider } = this.resolveModel(options?.model, options?.provider, options?.preference);
    const apiKey = this.resolveApiKey(provider);
    const startTime = Date.now();

    this.checkRateLimit(provider);

    const providerInstance = getProvider(provider, apiKey);
    const generateOptions: GenerateOptions = {
      model: modelId,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      userId: options?.userId,
      tags: options?.tags,
      maxRetries: 2,
    };

    let lastError: Error | null = null;
    const maxRetries = generateOptions.maxRetries || 0;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await providerInstance.generateText(messages, generateOptions);
        const latencyMs = Date.now() - startTime;
        response.latencyMs = latencyMs;

        const modelInfo = this.registry.get(modelId);
        if (modelInfo && response.usage) {
          const cost = this.costTracker.record(
            modelInfo,
            response.usage.promptTokens,
            response.usage.completionTokens,
            options?.userId,
            options?.tags,
          );
          response.cost = cost;
        }

        if (this.monitoring && response.usage) {
          const record = this.monitoring.createRecord({
            type: 'chat',
            provider,
            model: modelId,
            promptTokens: response.usage.promptTokens,
            completionTokens: response.usage.completionTokens,
            totalTokens: response.usage.totalTokens,
            cost: response.cost,
            latencyMs,
            success: true,
            userId: options?.userId,
            metadata: { tags: options?.tags },
          });
          this.monitoring.record(record).catch(() => {});
        }

        return response;
      } catch (err) {
        lastError = err as Error;
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }

    if (options?.preference?.fallbackModels) {
      const fallbackChain = this.router.getFallbackChain(options.preference.fallbackModels, options.preference);
      for (const fallback of fallbackChain) {
        if (fallback.model === modelId && fallback.provider === provider) continue;
        try {
          const fallbackProvider = getProvider(fallback.provider, this.resolveApiKey(fallback.provider));
          const response = await fallbackProvider.generateText(messages, { ...generateOptions, model: fallback.model });
          response.latencyMs = Date.now() - startTime;
          return response;
        } catch { }
      }
    }

    const errorMessage = lastError?.message || 'All providers failed';
    if (this.monitoring) {
      const record = this.monitoring.createRecord({
        type: 'chat',
        provider,
        model: modelId,
        success: false,
        errorMessage,
        latencyMs: Date.now() - startTime,
        userId: options?.userId,
      });
      this.monitoring.record(record).catch(() => {});
    }

    throw lastError || new Error('All providers failed');
  }

  async generateStream(messages: LLMMessage[], options?: {
    model?: string;
    provider?: LLMProviderType;
    preference?: RoutingPreference;
    userId?: string;
  }): Promise<AsyncIterable<string>> {
    const { model: modelId, provider } = this.resolveModel(options?.model, options?.provider, options?.preference);
    const apiKey = this.resolveApiKey(provider);
    const providerInstance = getProvider(provider, apiKey);
    return providerInstance.generateStream(messages, { model: modelId });
  }

  async generateEmbedding(text: string, provider?: LLMProviderType): Promise<number[]> {
    const p = provider || 'openai';
    const apiKey = this.resolveApiKey(p);
    const providerInstance = getProvider(p, apiKey);
    return providerInstance.generateEmbedding(text);
  }

  private resolveModel(modelId?: string, provider?: LLMProviderType, preference?: RoutingPreference): { model: string; provider: LLMProviderType } {
    if (modelId) {
      const info = this.registry.get(modelId);
      if (info) return { model: modelId, provider: info.provider };
      if (provider) return { model: modelId, provider };
      return { model: modelId, provider: 'openai' };
    }

    if (provider) {
      const defaultModel = this.registry.getDefault(provider);
      if (defaultModel) return { model: defaultModel.id, provider: provider };
    }

    if (preference) {
      return this.router.resolve(undefined, preference);
    }

    return { model: 'gpt-4o-mini', provider: 'openai' };
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
      bedrock: process.env.AWS_ACCESS_KEY_ID,
      vertex: process.env.GOOGLE_AI_API_KEY,
    };
    return envMap[provider];
  }

  private checkRateLimit(provider: LLMProviderType): void {
    const now = Date.now();
    const key = `rate:${provider}`;
    const entry = this.rateLimits.get(key);

    if (entry && now < entry.resetAt) {
      entry.count++;
      const limits: Record<string, number> = {
        openai: 500, anthropic: 200, google: 300, deepseek: 100,
        mistral: 200, openrouter: 300, groq: 100, cohere: 100,
      };
      const limit = limits[provider] || 100;
      if (entry.count > limit) {
        throw new Error(`Rate limit exceeded for ${provider}. Try again in ${Math.ceil((entry.resetAt - now) / 1000)}s`);
      }
    } else {
      this.rateLimits.set(key, { count: 1, resetAt: now + 60000 });
    }
  }
}
