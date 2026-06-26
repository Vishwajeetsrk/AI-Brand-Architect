import { Injectable, NotFoundException } from '@nestjs/common';
import { KnowledgeBase, knowledgeBase, KnowledgeArticle } from '@nexora/knowledge';

@Injectable()
export class KnowledgeService {
  private kb: KnowledgeBase;

  constructor() {
    this.kb = knowledgeBase;
    this.seedData();
  }

  private seedData() {
    const articles = [
      {
        title: 'Building a Strong Brand Identity',
        content: 'A comprehensive guide to creating a memorable brand identity that resonates with your target audience...',
        summary: 'Learn the fundamentals of brand identity design and strategy.',
        category: 'cat-1', tags: ['branding', 'identity', 'strategy'],
        authorId: 'system', status: 'published' as const, updatedAt: new Date().toISOString(),
      },
      {
        title: 'Color Psychology in Branding',
        content: 'Understanding how colors influence perception and decision-making in brand design...',
        summary: 'Deep dive into color theory and its application in brand design.',
        category: 'cat-2', tags: ['design', 'colors', 'psychology'],
        authorId: 'system', status: 'published' as const, updatedAt: new Date().toISOString(),
      },
      {
        title: 'Social Media Branding Guide',
        content: 'How to maintain consistent brand presence across all social media platforms...',
        summary: 'Best practices for cohesive social media branding.',
        category: 'cat-3', tags: ['social-media', 'marketing', 'branding'],
        authorId: 'system', status: 'published' as const, updatedAt: new Date().toISOString(),
      },
    ];
    articles.forEach(a => this.kb.createArticle(a));
  }

  getCategories() { return this.kb.getCategories(); }

  getArticles(categoryId?: string) { return this.kb.getArticles(categoryId); }

  getArticle(id: string) {
    const article = this.kb.getArticle(id);
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  createArticle(data: Partial<KnowledgeArticle> & { title: string; content: string }) {
    return this.kb.createArticle({
      title: data.title,
      content: data.content,
      summary: data.summary || data.content.slice(0, 200),
      category: data.category || 'cat-1',
      tags: data.tags || [],
      authorId: data.authorId || 'system',
      status: data.status || 'draft',
      updatedAt: new Date().toISOString(),
    });
  }

  updateArticle(id: string, data: Partial<KnowledgeArticle>) { return this.kb.updateArticle(id, data); }

  deleteArticle(id: string) { return this.kb.deleteArticle(id); }

  search(query: string) { return this.kb.search(query); }
}
