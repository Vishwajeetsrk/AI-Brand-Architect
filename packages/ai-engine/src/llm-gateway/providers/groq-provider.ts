import { OpenAIProvider } from '../../llm/openai-provider';

export class GroqProvider extends OpenAIProvider {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.groq.com/openai/v1');
  }
}
