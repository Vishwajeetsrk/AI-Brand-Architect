import { Injectable } from '@nestjs/common';
import { LLMProvider, GenerateOptions, StreamChunk } from './llm-provider.interface';

@Injectable()
export class AnthropicProvider implements LLMProvider {
  private baseUrl = 'https://api.anthropic.com/v1';

  async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: options?.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options?.maxTokens || 2048,
        system: options?.systemPrompt,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  }

  async *generateStream(prompt: string, options?: GenerateOptions): AsyncGenerator<StreamChunk> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: options?.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options?.maxTokens || 2048,
        system: options?.systemPrompt,
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${err}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            if (parsed.type === 'content_block_delta') {
              const text = parsed.delta?.text || '';
              if (text) {
                yield { content: text, done: false };
              }
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    }

    yield { content: '', done: true };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    throw new Error('Anthropic does not provide embedding APIs directly. Use OpenAI for embeddings.');
  }
}
