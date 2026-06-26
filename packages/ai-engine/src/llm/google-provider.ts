import { LLMProvider, LLMMessage, LLMResponse, GenerateOptions, LLMProviderType } from '../types';

export class GoogleProvider implements LLMProvider {
  private apiKey: string;
  private baseUrl: string;
  readonly providerType: LLMProviderType = 'google';

  constructor(apiKey: string, baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta') {
    if (!apiKey) throw new Error('Google AI API key is required');
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async generateText(messages: LLMMessage[], options?: GenerateOptions): Promise<LLMResponse> {
    const model = options?.model || 'gemini-2.0-flash';
    const contents = this.buildContents(messages);

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {},
    };

    if (options?.temperature !== undefined) body.generationConfig = { ...body.generationConfig as object, temperature: options.temperature };
    if (options?.maxTokens !== undefined) body.generationConfig = { ...body.generationConfig as object, maxOutputTokens: options.maxTokens };
    if (options?.topP !== undefined) body.generationConfig = { ...body.generationConfig as object, topP: options.topP };
    if (options?.stop?.length) body.generationConfig = { ...body.generationConfig as object, stopSequences: options.stop };

    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google AI API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return this.parseResponse(data, model);
  }

  async *generateStream(messages: LLMMessage[], options?: GenerateOptions): AsyncIterable<string> {
    const model = options?.model || 'gemini-2.0-flash';
    const contents = this.buildContents(messages);

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {},
    };

    if (options?.temperature !== undefined) body.generationConfig = { ...body.generationConfig as object, temperature: options.temperature };
    if (options?.maxTokens !== undefined) body.generationConfig = { ...body.generationConfig as object, maxOutputTokens: options.maxTokens };
    if (options?.topP !== undefined) body.generationConfig = { ...body.generationConfig as object, topP: options.topP };

    const response = await fetch(
      `${this.baseUrl}/models/${model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google AI streaming error (${response.status}): ${error}`);
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
            const text = data.candidates?.[0]?.content?.parts
              ?.filter((p: any) => p.text)
              .map((p: any) => p.text)
              .join('') || '';
            if (text) yield text;
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
    const model = 'text-embedding-004';

    const response = await fetch(
      `${this.baseUrl}/models/${model}:embedContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${model}`,
          content: { parts: [{ text }] },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google AI embedding error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return data.embedding?.values || [];
  }

  private buildContents(messages: LLMMessage[]): Array<{ role: string; parts: Array<{ text: string }> }> {
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    let systemPrompt = '';

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemPrompt += msg.content + '\n';
        continue;
      }

      const role = msg.role === 'assistant' ? 'model' : 'user';
      let text = msg.content;
      if (systemPrompt && role === 'user') {
        text = `System instructions: ${systemPrompt.trim()}\n\n${text}`;
        systemPrompt = '';
      }

      contents.push({
        role,
        parts: [{ text }],
      });
    }

    return contents;
  }

  private parseResponse(data: any, model: string): LLMResponse {
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts
      ?.filter((p: any) => p.text)
      .map((p: any) => p.text)
      .join('') || '';

    return {
      content: text,
      model: model,
      provider: this.providerType,
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount || 0,
            completionTokens: data.usageMetadata.candidatesTokenCount || 0,
            totalTokens: data.usageMetadata.totalTokenCount || 0,
          }
        : undefined,
      finishReason: candidate?.finishReason || undefined,
    };
  }
}
