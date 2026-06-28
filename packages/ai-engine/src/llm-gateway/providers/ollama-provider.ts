import { LLMProvider, LLMMessage, LLMResponse, GenerateOptions, LLMProviderType } from '../../types';

export class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  readonly providerType: LLMProviderType = 'ollama';

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async generateText(messages: LLMMessage[], options?: GenerateOptions): Promise<LLMResponse> {
    const model = options?.model || 'llama3.2';
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: false,
        options: {
          temperature: options?.temperature,
          num_predict: options?.maxTokens,
        },
      }),
    });

    if (!response.ok) throw new Error(`Ollama API error (${response.status}): ${await response.text()}`);
    const data = await response.json();
    return {
      content: data.message?.content || '',
      model,
      provider: this.providerType,
      finishReason: data.done ? 'stop' : undefined,
    };
  }

  async *generateStream(messages: LLMMessage[], options?: GenerateOptions): AsyncIterable<string> {
    const model = options?.model || 'llama3.2';
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true }),
    });

    if (!response.ok) throw new Error(`Ollama streaming error (${response.status})`);

    const reader = response.body?.getReader();
    if (!reader) return;
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
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.message?.content) yield data.message.content;
          } catch { }
        }
      }
    } finally { reader.releaseLock(); }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3.2', prompt: text }),
    });
    if (!response.ok) throw new Error(`Ollama embedding error (${response.status})`);
    const data = await response.json();
    return data.embedding || [];
  }
}
