import { LLMProvider, LLMMessage, LLMResponse, GenerateOptions, LLMProviderType } from '../types';

export class AnthropicProvider implements LLMProvider {
  private apiKey: string;
  private baseUrl: string;
  readonly providerType: LLMProviderType = 'anthropic';

  constructor(apiKey: string, baseUrl: string = 'https://api.anthropic.com/v1') {
    if (!apiKey) throw new Error('Anthropic API key is required');
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async generateText(messages: LLMMessage[], options?: GenerateOptions): Promise<LLMResponse> {
    const model = options?.model || 'claude-3-5-sonnet-20241022';
    const { system, userMessages } = this.separateSystemMessages(messages);

    const body: Record<string, unknown> = {
      model,
      max_tokens: options?.maxTokens || 4096,
      messages: userMessages,
    };

    if (system) body.system = system;
    if (options?.temperature !== undefined) body.temperature = options.temperature;
    if (options?.topP !== undefined) body.top_p = options.topP;
    if (options?.stop?.length) body.stop_sequences = options.stop;

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return this.parseResponse(data, model);
  }

  async *generateStream(messages: LLMMessage[], options?: GenerateOptions): AsyncIterable<string> {
    const model = options?.model || 'claude-3-5-sonnet-20241022';
    const { system, userMessages } = this.separateSystemMessages(messages);

    const body: Record<string, unknown> = {
      model,
      max_tokens: options?.maxTokens || 4096,
      messages: userMessages,
      stream: true,
    };

    if (system) body.system = system;
    if (options?.temperature !== undefined) body.temperature = options.temperature;
    if (options?.topP !== undefined) body.top_p = options.topP;
    if (options?.stop?.length) body.stop_sequences = options.stop;

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic streaming error (${response.status}): ${error}`);
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
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.type === 'content_block_delta' && data.delta?.type === 'text_delta') {
              yield data.delta.text || '';
            }
          } catch {
            // Skip malformed JSON
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
        model: 'claude-3-5-sonnet-20241022',
        input: text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic embedding error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return data.embedding || [];
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
    };
  }

  private separateSystemMessages(messages: LLMMessage[]): {
    system?: string;
    userMessages: Array<{ role: string; content: string }>;
  } {
    const systemMessages = messages.filter(m => m.role === 'system');
    const system = systemMessages.map(m => m.content).join('\n');

    const userMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

    return { system: system || undefined, userMessages };
  }

  private parseResponse(data: any, model: string): LLMResponse {
    const content = data.content
      ?.filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('') || '';

    return {
      content,
      model: data.model || model,
      provider: this.providerType,
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens,
          }
        : undefined,
      finishReason: data.stop_reason || undefined,
    };
  }
}
