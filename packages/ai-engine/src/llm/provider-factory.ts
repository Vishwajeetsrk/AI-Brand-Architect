import { LLMProvider, LLMProviderType } from '../types';
import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { GoogleProvider } from './google-provider';
import { OpenRouterProvider } from '../llm-gateway/providers/openrouter-provider';
import { GroqProvider } from '../llm-gateway/providers/groq-provider';
import { CohereProvider } from '../llm-gateway/providers/cohere-provider';
import { OllamaProvider } from '../llm-gateway/providers/ollama-provider';

const providerCache = new Map<string, LLMProvider>();

export function getProvider(provider: LLMProviderType, apiKey?: string): LLMProvider {
  const key = `${provider}:${apiKey?.slice(0, 8)}`;
  if (providerCache.has(key)) return providerCache.get(key)!;

  const instance = createProvider(provider, apiKey);
  providerCache.set(key, instance);
  return instance;
}

function createProvider(provider: LLMProviderType, apiKey?: string): LLMProvider {
  const key = apiKey || '';
  switch (provider) {
    case 'openai':
      return new OpenAIProvider(key || process.env.OPENAI_API_KEY || '');
    case 'anthropic':
      return new AnthropicProvider(key || process.env.ANTHROPIC_API_KEY || '');
    case 'google':
    case 'vertex':
      return new GoogleProvider(key || process.env.GOOGLE_AI_API_KEY || '');
    case 'openrouter':
      return new OpenRouterProvider(key || process.env.OPENROUTER_API_KEY || '');
    case 'groq':
      return new GroqProvider(key || process.env.GROQ_API_KEY || '');
    case 'cohere':
      return new CohereProvider(key || process.env.COHERE_API_KEY || '');
    case 'ollama':
      return new OllamaProvider(key || process.env.OLLAMA_HOST || 'http://localhost:11434');
    case 'deepseek':
      return new OpenAIProvider(key || process.env.DEEPSEEK_API_KEY || '', 'https://api.deepseek.com/v1');
    case 'mistral':
      return new OpenAIProvider(key || process.env.MISTRAL_API_KEY || '', 'https://api.mistral.ai/v1');
    case 'xai':
      return new OpenAIProvider(key || process.env.XAI_API_KEY || '', 'https://api.x.ai/v1');
    case 'huggingface':
      return new OpenAIProvider(key || process.env.HUGGINGFACE_API_KEY || '', 'https://api-inference.huggingface.co/v1');
    case 'azure':
      return new OpenAIProvider(key || process.env.AZURE_OPENAI_KEY || '', process.env.AZURE_OPENAI_ENDPOINT || 'https://api.openai.com/v1');
    case 'bedrock':
      return new OpenAIProvider(key || process.env.AWS_ACCESS_KEY_ID || '');
    case 'together':
      return new OpenAIProvider(key || process.env.TOGETHER_API_KEY || '', 'https://api.together.xyz/v1');
    case 'perplexity':
      return new OpenAIProvider(key || process.env.PERPLEXITY_API_KEY || '', 'https://api.perplexity.ai');
    case 'lmstudio':
      return new OpenAIProvider(key || 'lm-studio', 'http://localhost:1234/v1');
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
