export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  logo?: string;
  colors?: BrandColors;
  typography?: BrandTypography;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandTypography {
  headingFont: string;
  bodyFont: string;
  baseSize: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  brandId: string;
  userId: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | '3d' | 'other';
  url: string;
  size?: number;
  mimeType?: string;
  projectId?: string;
  userId: string;
  createdAt: string;
}

export interface AIModel {
  id: string;
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'mistral' | 'custom';
  model: string;
  apiKey?: string;
  config?: Record<string, unknown>;
  userId: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  description?: string;
  type: 'brand' | 'marketing' | 'design' | 'content' | 'research' | 'custom';
  config?: Record<string, unknown>;
  userId: string;
  modelId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tags?: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}
