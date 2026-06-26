export type LLMProviderType = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'mistral' | 'custom';

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
