export type LLMProviderType =
  | 'openai' | 'anthropic' | 'google' | 'deepseek' | 'mistral'
  | 'openrouter' | 'groq' | 'cohere' | 'xai' | 'ollama'
  | 'lmstudio' | 'glm' | 'huggingface' | 'azure' | 'bedrock'
  | 'vertex' | 'together' | 'perplexity' | 'custom';

export type RoutingStrategy =
  | 'cost' | 'quality' | 'latency' | 'capability'
  | 'fallback' | 'hybrid' | 'consensus' | 'manual';

export interface ModelCapabilities {
  reasoning: boolean;
  coding: boolean;
  vision: boolean;
  functionCalling: boolean;
  streaming: boolean;
  embeddings: boolean;
  jsonMode: boolean;
}

export interface ModelPricing {
  inputPerMillionTokens: number;
  outputPerMillionTokens: number;
  currency: string;
}

export interface ModelInfo {
  id: string;
  provider: LLMProviderType;
  displayName: string;
  capabilities: ModelCapabilities;
  pricing: ModelPricing;
  contextWindow: number;
  maxOutputTokens: number;
  typicalLatencyMs: number;
  qualityScore: number;
  isDefault?: boolean;
}

export interface LLMConfig {
  provider: LLMProviderType;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stop?: string[];
  systemPrompt?: string;
  stream?: boolean;
  userId?: string;
  tags?: string[];
  maxRetries?: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCallId?: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: LLMProviderType;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
  latencyMs?: number;
  cost?: number;
}

export interface RoutingPreference {
  strategy: RoutingStrategy;
  maxCost?: number;
  minQuality?: number;
  maxLatencyMs?: number;
  requiredCapabilities?: (keyof ModelCapabilities)[];
  preferredProviders?: LLMProviderType[];
  fallbackModels?: string[];
}

export interface LLMProvider {
  generateText(messages: LLMMessage[], options?: GenerateOptions): Promise<LLMResponse>;
  generateStream(messages: LLMMessage[], options?: GenerateOptions): AsyncIterable<string>;
  generateEmbedding(text: string): Promise<number[]>;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  systemPrompt?: string;
  tags: string[];
  version: number;
}

export interface PromptExecutionResult {
  content: string;
  provider: LLMProviderType;
  model: string;
  usage?: LLMResponse['usage'];
  duration: number;
}

export interface Chunk {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
}

export interface Document {
  id: string;
  title: string;
  content: string;
  source: string;
  metadata: Record<string, unknown>;
  chunks: Chunk[];
}

export interface SearchResult {
  chunk: Chunk;
  score: number;
}

export interface RAGConfig {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  minScore: number;
}

export type MemoryType = 'working' | 'short_term' | 'long_term' | 'semantic' | 'episodic';

export interface Memory {
  id: string;
  type: MemoryType;
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
  timestamp: number;
  ttl?: number;
}

export type AgentType = 'brand_architect' | 'marketing' | 'content' | 'research' | 'design' | 'social_media' | 'seo' | 'custom';

export interface AgentConfig {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  systemPrompt: string;
  skills: string[];
  model: LLMConfig;
  memory?: {
    enabled: boolean;
    type: MemoryType[];
    ttl: number;
  };
  maxIterations: number;
  temperature: number;
}

export interface AgentContext {
  userId: string;
  organizationId?: string;
  projectId?: string;
  brandId?: string;
  sessionId: string;
  metadata: Record<string, unknown>;
}

export interface AgentTask {
  id: string;
  description: string;
  priority: number;
  dependencies: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
}

export interface AgentExecutionPlan {
  id: string;
  goal: string;
  tasks: AgentTask[];
  status: 'planning' | 'executing' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
}

export interface AgentExecutionResult {
  plan: AgentExecutionPlan;
  finalOutput: string;
  duration: number;
  tokenUsage: {
    total: number;
    byTask: Record<string, number>;
  };
}

export interface Skill {
  name: string;
  description: string;
  execute(input: Record<string, unknown>, context: AgentContext): Promise<Record<string, unknown>>;
}

export interface SkillResult {
  skillName: string;
  output: Record<string, unknown>;
  duration: number;
}
