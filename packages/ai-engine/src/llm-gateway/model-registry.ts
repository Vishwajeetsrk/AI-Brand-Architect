import { ModelInfo, ModelCapabilities, LLMProviderType, ModelPricing } from '../types';

const MODELS: ModelInfo[] = [
  {
    id: 'gpt-4o', provider: 'openai', displayName: 'GPT-4o',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: true, jsonMode: true },
    pricing: { inputPerMillionTokens: 2.50, outputPerMillionTokens: 10.00, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 16384, typicalLatencyMs: 2000, qualityScore: 95, isDefault: true,
  },
  {
    id: 'gpt-4o-mini', provider: 'openai', displayName: 'GPT-4o Mini',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: true, jsonMode: true },
    pricing: { inputPerMillionTokens: 0.15, outputPerMillionTokens: 0.60, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 16384, typicalLatencyMs: 800, qualityScore: 82,
  },
  {
    id: 'claude-3-5-sonnet-20241022', provider: 'anthropic', displayName: 'Claude 3.5 Sonnet',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: false, jsonMode: true },
    pricing: { inputPerMillionTokens: 3.00, outputPerMillionTokens: 15.00, currency: 'USD' },
    contextWindow: 200000, maxOutputTokens: 8192, typicalLatencyMs: 2500, qualityScore: 94, isDefault: true,
  },
  {
    id: 'claude-3-haiku-20240307', provider: 'anthropic', displayName: 'Claude 3 Haiku',
    capabilities: { reasoning: false, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: false, jsonMode: true },
    pricing: { inputPerMillionTokens: 0.25, outputPerMillionTokens: 1.25, currency: 'USD' },
    contextWindow: 200000, maxOutputTokens: 4096, typicalLatencyMs: 600, qualityScore: 78,
  },
  {
    id: 'gemini-2.0-flash', provider: 'google', displayName: 'Gemini 2.0 Flash',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: true, jsonMode: true },
    pricing: { inputPerMillionTokens: 0.10, outputPerMillionTokens: 0.40, currency: 'USD' },
    contextWindow: 1048576, maxOutputTokens: 8192, typicalLatencyMs: 700, qualityScore: 85, isDefault: true,
  },
  {
    id: 'gemini-1.5-pro', provider: 'google', displayName: 'Gemini 1.5 Pro',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: true, jsonMode: true },
    pricing: { inputPerMillionTokens: 1.25, outputPerMillionTokens: 5.00, currency: 'USD' },
    contextWindow: 2097152, maxOutputTokens: 8192, typicalLatencyMs: 3000, qualityScore: 92,
  },
  {
    id: 'deepseek-chat', provider: 'deepseek', displayName: 'DeepSeek V3',
    capabilities: { reasoning: true, coding: true, vision: false, functionCalling: true, streaming: true, embeddings: false, jsonMode: true },
    pricing: { inputPerMillionTokens: 0.27, outputPerMillionTokens: 1.10, currency: 'USD' },
    contextWindow: 64000, maxOutputTokens: 8192, typicalLatencyMs: 1500, qualityScore: 80, isDefault: true,
  },
  {
    id: 'mistral-large', provider: 'mistral', displayName: 'Mistral Large',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: true, jsonMode: true },
    pricing: { inputPerMillionTokens: 2.00, outputPerMillionTokens: 6.00, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 8192, typicalLatencyMs: 2000, qualityScore: 83, isDefault: true,
  },
  {
    id: 'mistral-small', provider: 'mistral', displayName: 'Mistral Small',
    capabilities: { reasoning: false, coding: true, vision: false, functionCalling: true, streaming: true, embeddings: true, jsonMode: true },
    pricing: { inputPerMillionTokens: 0.20, outputPerMillionTokens: 0.60, currency: 'USD' },
    contextWindow: 32000, maxOutputTokens: 4096, typicalLatencyMs: 500, qualityScore: 72,
  },
  {
    id: 'openrouter/auto', provider: 'openrouter', displayName: 'OpenRouter Auto',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: false, jsonMode: true },
    pricing: { inputPerMillionTokens: 0.0, outputPerMillionTokens: 0.0, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 16384, typicalLatencyMs: 1500, qualityScore: 90, isDefault: true,
  },
  {
    id: 'llama-3.3-70b', provider: 'groq', displayName: 'Llama 3.3 70B (Groq)',
    capabilities: { reasoning: true, coding: true, vision: false, functionCalling: true, streaming: true, embeddings: false, jsonMode: true },
    pricing: { inputPerMillionTokens: 0.59, outputPerMillionTokens: 0.79, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 8192, typicalLatencyMs: 300, qualityScore: 84, isDefault: true,
  },
  {
    id: 'mixtral-8x7b-32768', provider: 'groq', displayName: 'Mixtral 8x7B (Groq)',
    capabilities: { reasoning: true, coding: true, vision: false, functionCalling: false, streaming: true, embeddings: false, jsonMode: false },
    pricing: { inputPerMillionTokens: 0.27, outputPerMillionTokens: 0.27, currency: 'USD' },
    contextWindow: 32768, maxOutputTokens: 4096, typicalLatencyMs: 200, qualityScore: 73,
  },
  {
    id: 'command-r-plus', provider: 'cohere', displayName: 'Command R+',
    capabilities: { reasoning: true, coding: true, vision: false, functionCalling: true, streaming: true, embeddings: true, jsonMode: false },
    pricing: { inputPerMillionTokens: 3.00, outputPerMillionTokens: 15.00, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 4096, typicalLatencyMs: 2000, qualityScore: 76, isDefault: true,
  },
  {
    id: 'grok-2', provider: 'xai', displayName: 'Grok 2',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: false, jsonMode: true },
    pricing: { inputPerMillionTokens: 2.00, outputPerMillionTokens: 10.00, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 8192, typicalLatencyMs: 2500, qualityScore: 81, isDefault: true,
  },
  {
    id: 'llama3.2', provider: 'ollama', displayName: 'Llama 3.2 (Local)',
    capabilities: { reasoning: false, coding: true, vision: true, functionCalling: false, streaming: true, embeddings: true, jsonMode: false },
    pricing: { inputPerMillionTokens: 0.0, outputPerMillionTokens: 0.0, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 4096, typicalLatencyMs: 5000, qualityScore: 65, isDefault: true,
  },
  {
    id: 'qwen2.5-7b', provider: 'lmstudio', displayName: 'Qwen 2.5 7B (Local)',
    capabilities: { reasoning: false, coding: true, vision: false, functionCalling: false, streaming: true, embeddings: true, jsonMode: false },
    pricing: { inputPerMillionTokens: 0.0, outputPerMillionTokens: 0.0, currency: 'USD' },
    contextWindow: 32768, maxOutputTokens: 4096, typicalLatencyMs: 6000, qualityScore: 58, isDefault: true,
  },
  {
    id: 'glm-4-plus', provider: 'glm', displayName: 'GLM-4 Plus',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: true, jsonMode: true },
    pricing: { inputPerMillionTokens: 0.50, outputPerMillionTokens: 2.00, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 4096, typicalLatencyMs: 2000, qualityScore: 75, isDefault: true,
  },
  {
    id: 'meta-llama/Meta-Llama-3.1-70B', provider: 'huggingface', displayName: 'Llama 3.1 70B (HF)',
    capabilities: { reasoning: true, coding: true, vision: false, functionCalling: false, streaming: true, embeddings: false, jsonMode: false },
    pricing: { inputPerMillionTokens: 0.90, outputPerMillionTokens: 0.90, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 4096, typicalLatencyMs: 3500, qualityScore: 77, isDefault: true,
  },
  {
    id: 'gpt-4o-azure', provider: 'azure', displayName: 'GPT-4o (Azure)',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: true, jsonMode: true },
    pricing: { inputPerMillionTokens: 2.50, outputPerMillionTokens: 10.00, currency: 'USD' },
    contextWindow: 128000, maxOutputTokens: 16384, typicalLatencyMs: 2000, qualityScore: 95, isDefault: true,
  },
  {
    id: 'claude-3-5-sonnet-bedrock', provider: 'bedrock', displayName: 'Claude 3.5 Sonnet (Bedrock)',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: false, jsonMode: true },
    pricing: { inputPerMillionTokens: 3.00, outputPerMillionTokens: 15.00, currency: 'USD' },
    contextWindow: 200000, maxOutputTokens: 8192, typicalLatencyMs: 2500, qualityScore: 94, isDefault: true,
  },
  {
    id: 'gemini-1.5-pro-vertex', provider: 'vertex', displayName: 'Gemini 1.5 Pro (Vertex)',
    capabilities: { reasoning: true, coding: true, vision: true, functionCalling: true, streaming: true, embeddings: true, jsonMode: true },
    pricing: { inputPerMillionTokens: 1.25, outputPerMillionTokens: 5.00, currency: 'USD' },
    contextWindow: 2097152, maxOutputTokens: 8192, typicalLatencyMs: 3000, qualityScore: 92, isDefault: true,
  },
];

export class ModelRegistry {
  private models: Map<string, ModelInfo> = new Map();

  constructor() {
    for (const model of MODELS) {
      this.models.set(model.id, model);
    }
  }

  get(modelId: string): ModelInfo | undefined {
    return this.models.get(modelId);
  }

  getAll(): ModelInfo[] {
    return Array.from(this.models.values());
  }

  getByProvider(provider: LLMProviderType): ModelInfo[] {
    return Array.from(this.models.values()).filter(m => m.provider === provider);
  }

  getDefault(provider: LLMProviderType): ModelInfo | undefined {
    return Array.from(this.models.values()).find(m => m.provider === provider && m.isDefault);
  }

  findByCapability(capability: keyof ModelCapabilities): ModelInfo[] {
    return Array.from(this.models.values()).filter(m => m.capabilities[capability]);
  }

  findCheapest(minQuality?: number): ModelInfo[] {
    return Array.from(this.models.values())
      .filter(m => !minQuality || m.qualityScore >= minQuality)
      .sort((a, b) => a.pricing.inputPerMillionTokens - b.pricing.inputPerMillionTokens);
  }

  findFastest(minQuality?: number): ModelInfo[] {
    return Array.from(this.models.values())
      .filter(m => !minQuality || m.qualityScore >= minQuality)
      .sort((a, b) => a.typicalLatencyMs - b.typicalLatencyMs);
  }

  findBestQuality(maxCostPerMillion?: number): ModelInfo[] {
    return Array.from(this.models.values())
      .filter(m => !maxCostPerMillion || m.pricing.inputPerMillionTokens <= maxCostPerMillion)
      .sort((a, b) => b.qualityScore - a.qualityScore);
  }

  registerModel(model: ModelInfo): void {
    this.models.set(model.id, model);
  }
}
