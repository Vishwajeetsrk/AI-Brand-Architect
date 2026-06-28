import { LLMProvider, LLMMessage, LLMResponse, GenerateOptions, LLMProviderType } from '../../types';

export class LMStudioProvider implements LLMProvider {
  private baseUrl: string;
  readonly providerType: LLMProviderType = 'lmstudio';

  constructor(baseUrl: string = 'http://localhost:1234') {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async generateText(messages: LLMMessage[], options?: GenerateOptions): Promise<LLMResponse> {
    const model = options?.model || 'qwen2.5-7b';
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: options?.temperature,
        max_tokens: options?.maxTokens,
      }),
    });

    if (!response.ok) throw new Error(`LM Studio error (${response.status}): ${await response.text()}`);
    const data = await response.json();
    const choice = data.choices?.[0];
    return {
      content: choice?.message?.content || '',
      model: data.model || model,
      provider: this.providerType,
      usage: data.usage ? { promptTokens: data.usage.prompt_tokens, completionTokens: data.usage.completion_tokens, totalTokens: data.usage.total_tokens } : undefined,
      finishReason: choice?.finish_reason,
    };
  }

  async *generateStream(messages: LLMMessage[], options?: GenerateOptions): AsyncIterable<string> {
    const model = options?.model || 'qwen2.5-7b';
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true }),
    });

    if (!response.ok) throw new Error(`LM Studio streaming error (${response.status})`);

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
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          if (trimmed === 'data: [DONE]') return;
          try { const d = JSON.parse(trimmed.slice(6)); const c = d.choices?.[0]?.delta?.content; if (c) yield c; } catch { }
        }
      }
    } finally { reader.releaseLock(); }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/v1/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'qwen2.5-7b', input: text }),
    });
    if (!response.ok) throw new Error(`LM Studio embedding error (${response.status})`);
    const data = await response.json();
    return data.data?.[0]?.embedding || [];
  }
}
