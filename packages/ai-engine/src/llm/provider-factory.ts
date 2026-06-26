import { LLMProvider, LLMProviderType } from '../types';
import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { GoogleProvider } from './google-provider';

const providerCache = new Map<string, LLMProvider>();

export function getProvider(provider: LLMProviderType, apiKey?: string): LLMProvider {
  const key = `${provider}:${apiKey?.slice(0, 8)}`;
  if (providerCache.has(key)) return providerCache.get(key)!;

  const instance = createProvider(provider, apiKey);
  providerCache.set(key, instance);
  return instance;
}

function createProvider(provider: LLMProviderType, apiKey?: string): LLMProvider {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider(apiKey || process.env.OPENAI_API_KEY || '');
    case 'anthropic':
      return new AnthropicProvider(apiKey || process.env.ANTHROPIC_API_KEY || '');
    case 'google':
      return new GoogleProvider(apiKey || process.env.GOOGLE_AI_API_KEY || '');
    case 'deepseek':
      return new OpenAIProvider(apiKey || process.env.DEEPSEEK_API_KEY || '', 'https://api.deepseek.com/v1');
    case 'mistral':
      return new OpenAIProvider(apiKey || process.env.MISTRAL_API_KEY || '', 'https://api.mistral.ai/v1');
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
