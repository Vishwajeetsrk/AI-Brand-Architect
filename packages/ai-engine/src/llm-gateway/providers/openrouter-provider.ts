import { OpenAIProvider } from '../../llm/openai-provider';

export class OpenRouterProvider extends OpenAIProvider {
  constructor(apiKey: string) {
    super(apiKey, 'https://openrouter.ai/api/v1');
  }

  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'HTTP-Referer': process.env.APP_URL || 'https://nexora.app',
      'X-Title': 'NEXORA',
    };
  }
}
