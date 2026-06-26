import { api } from './api';

export interface GenerateContentDto {
  prompt: string;
  type: 'logo' | 'website' | 'email' | 'social' | 'marketing' | 'uiux' | 'presentation' | 'form' | 'content' | 'tagline' | 'brand_analysis';
  brandContext?: {
    name: string;
    description: string;
    industry?: string;
    voice?: string;
  };
  model?: string;
  temperature?: number;
}

export interface GenerationResult {
  content: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AgentExecuteDto {
  agentId: string;
  input: string;
  context?: {
    brandId?: string;
    projectId?: string;
  };
}

export const aiService = {
  generate: (data: GenerateContentDto) => api.post<GenerationResult>('/ai/generate', data),
  streamGenerate: (data: GenerateContentDto, onChunk: (text: string) => void) => {
    const token = localStorage.getItem('nexora_token');
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/ai/generate/stream?` +
      `prompt=${encodeURIComponent(data.prompt)}&type=${data.type}&token=${token}`
    );
    eventSource.onmessage = (event) => onChunk(event.data);
    return () => eventSource.close();
  },
  executeAgent: (data: AgentExecuteDto) => api.post<{ output: string; plan: unknown; duration: number }>('/agents/execute', data),
  getPrompts: () => api.get<{ id: string; title: string; content: string; tags: string[] }[]>('/ai/prompts'),
  createPrompt: (data: { title: string; content: string; systemPrompt?: string; tags?: string[] }) =>
    api.post('/ai/prompts', data),
};

export const promptService = {
  getTemplates: () => api.get<{ id: string; name: string; description: string; variables: string[]; tags: string[] }[]>('/ai/prompts/templates'),
  executeTemplate: (templateId: string, variables: Record<string, string>) =>
    api.post<{ content: string; provider: string; model: string; duration: number }>('/ai/prompts/execute', { templateId, variables }),
};
