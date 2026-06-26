export interface KnowledgeArticle {
  id: string; title: string; content: string; summary: string;
  category: string; tags: string[]; authorId: string;
  status: 'draft' | 'published' | 'archived';
  version: number; createdAt: string; updatedAt: string;
}

export interface KnowledgeCategory {
  id: string; name: string; description: string;
  icon: string; articleCount: number; parentId?: string;
}

export interface KnowledgeSearchResult {
  article: KnowledgeArticle; score: number;
  highlights: { field: string; snippet: string }[];
}

export interface BrandKnowledge {
  id: string; brandId: string;
  guidelines: string; voiceGuide: string;
  visualAssets: string[]; competitorAnalysis: string;
  marketPositioning: string; audienceInsights: string;
  updatedAt: string;
}
