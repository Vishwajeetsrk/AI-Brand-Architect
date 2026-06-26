import { LLMProvider, LLMMessage, LLMResponse, GenerateOptions, LLMProviderType } from '../types';

export class OpenAIProvider implements LLMProvider {
  private apiKey: string;
  private baseUrl: string;
  readonly providerType: LLMProviderType;

  constructor(apiKey: string, baseUrl: string = 'https://api.openai.com/v1') {
    if (!apiKey) throw new Error('OpenAI API key is required');
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.providerType = baseUrl.includes('api.openai.com') ? 'openai' : 'custom';
  }

  async generateText(messages: LLMMessage[], options?: GenerateOptions): Promise<LLMResponse> {
    const model = options?.model || this.getDefaultModel();
    const body = this.buildRequestBody(messages, model, options);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return this.parseResponse(data, model);
  }

  async *generateStream(messages: LLMMessage[], options?: GenerateOptions): AsyncIterable<string> {
    const model = options?.model || this.getDefaultModel();
    const body = this.buildRequestBody(messages, model, { ...options, stream: true });

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI streaming error (${response.status}): ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) yield content;
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI embedding error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return data.data?.[0]?.embedding || [];
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  private buildRequestBody(messages: LLMMessage[], model: string, options?: GenerateOptions): Record<string, unknown> {
    const body: Record<string, unknown> = {
      model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        ...(m.name ? { name: m.name } : {}),
      })),
    };

    if (options?.temperature !== undefined) body.temperature = options.temperature;
    if (options?.maxTokens !== undefined) body.max_tokens = options.maxTokens;
    if (options?.topP !== undefined) body.top_p = options.topP;
    if (options?.stop?.length) body.stop = options.stop;
    if (options?.stream) body.stream = true;

    return body;
  }

  private parseResponse(data: any, model: string): LLMResponse {
    const choice = data.choices?.[0];
    return {
      content: choice?.message?.content || '',
      model: data.model || model,
      provider: this.providerType,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
      finishReason: choice?.finish_reason || undefined,
    };
  }

  private getDefaultModel(): string {
    if (this.baseUrl.includes('api.openai.com')) return 'gpt-4o-mini';
    return 'gpt-4o-mini';
  }
}
