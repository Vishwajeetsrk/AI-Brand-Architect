export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  systemPrompt?: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface LLMProvider {
  generateText(prompt: string, options?: GenerateOptions): Promise<string>;
  generateStream(prompt: string, options?: GenerateOptions): AsyncGenerator<StreamChunk>;
  generateEmbedding(text: string): Promise<number[]>;
}
