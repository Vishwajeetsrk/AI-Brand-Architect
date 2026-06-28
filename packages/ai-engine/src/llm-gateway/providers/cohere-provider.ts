import { LLMProvider, LLMMessage, LLMResponse, GenerateOptions, LLMProviderType } from '../../types';

export class CohereProvider implements LLMProvider {
  private apiKey: string;
  readonly providerType: LLMProviderType = 'cohere';

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('Cohere API key is required');
    this.apiKey = apiKey;
  }

  async generateText(messages: LLMMessage[], options?: GenerateOptions): Promise<LLMResponse> {
    const model = options?.model || 'command-r-plus';
    const preamble = messages.filter(m => m.role === 'system').map(m => m.content).join('\n');
    const chatHistory = messages.filter(m => m.role !== 'system').slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'CHATBOT' : 'USER',
      message: m.content,
    }));
    const lastMessage = messages.filter(m => m.role !== 'system').pop();

    const body: Record<string, unknown> = {
      model,
      message: lastMessage?.content || '',
      chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
      preamble: preamble || undefined,
      maxTokens: options?.maxTokens || 4096,
    };

    if (options?.temperature !== undefined) body.temperature = options.temperature;

    const response = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cohere API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return {
      content: data.text || data.message?.content?.[0]?.text || '',
      model: data.model || model,
      provider: this.providerType,
      usage: data.usage ? { promptTokens: data.usage.inputTokens || 0, completionTokens: data.usage.outputTokens || 0, totalTokens: (data.usage.inputTokens || 0) + (data.usage.outputTokens || 0) } : undefined,
      finishReason: data.finishReason,
    };
  }

  async *generateStream(messages: LLMMessage[], options?: GenerateOptions): AsyncIterable<string> {
    const model = options?.model || 'command-r-plus';
    const lastMessage = messages.filter(m => m.role !== 'system').pop();

    const response = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model, message: lastMessage?.content || '', stream: true }),
    });

    if (!response.ok) throw new Error(`Cohere streaming error (${response.status})`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body not readable');

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
          if (!line.trim() || !line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'text-generation' && data.text) yield data.text;
          } catch { }
        }
      }
    } finally { reader.releaseLock(); }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch('https://api.cohere.com/v2/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ texts: [text], model: 'embed-english-v3.0', inputType: 'search_query' }),
    });
    if (!response.ok) throw new Error(`Cohere embedding error (${response.status})`);
    const data = await response.json();
    return data.embeddings?.[0] || [];
  }
}
