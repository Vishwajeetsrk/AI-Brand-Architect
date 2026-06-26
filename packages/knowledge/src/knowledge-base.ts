import { KnowledgeArticle, KnowledgeCategory, KnowledgeSearchResult } from './types';

export class KnowledgeBase {
  private articles: Map<string, KnowledgeArticle> = new Map();
  private categories: Map<string, KnowledgeCategory> = new Map();

  constructor() {
    this.seedDefaultCategories();
  }

  private seedDefaultCategories() {
    const cats = [
      { id: 'cat-1', name: 'Brand Strategy', description: 'Brand positioning, voice, and identity guides', icon: 'target', articleCount: 0 },
      { id: 'cat-2', name: 'Design Resources', description: 'Templates, color palettes, typography guides', icon: 'palette', articleCount: 0 },
      { id: 'cat-3', name: 'Marketing', description: 'Campaign strategies, content calendars, SEO guides', icon: 'megaphone', articleCount: 0 },
      { id: 'cat-4', name: 'Industry Insights', description: 'Market research, trends, competitor analysis', icon: 'trending-up', articleCount: 0 },
      { id: 'cat-5', name: 'Best Practices', description: 'Proven strategies and case studies', icon: 'award', articleCount: 0 },
    ];
    cats.forEach(c => this.categories.set(c.id, c));
  }

  getCategories(): KnowledgeCategory[] {
    return Array.from(this.categories.values());
  }

  getArticles(categoryId?: string): KnowledgeArticle[] {
    const all = Array.from(this.articles.values());
    return categoryId ? all.filter(a => a.category === categoryId) : all;
  }

  getArticle(id: string): KnowledgeArticle | undefined {
    return this.articles.get(id);
  }

  createArticle(article: Omit<KnowledgeArticle, 'id' | 'version' | 'createdAt'>): KnowledgeArticle {
    const newArticle: KnowledgeArticle = {
      ...article, id: crypto.randomUUID(), version: 1, createdAt: new Date().toISOString(),
    };
    this.articles.set(newArticle.id, newArticle);
    return newArticle;
  }

  updateArticle(id: string, updates: Partial<KnowledgeArticle>): KnowledgeArticle | undefined {
    const article = this.articles.get(id);
    if (!article) return undefined;
    const updated = { ...article, ...updates, version: article.version + 1, updatedAt: new Date().toISOString() };
    this.articles.set(id, updated);
    return updated;
  }

  deleteArticle(id: string): boolean {
    return this.articles.delete(id);
  }

  search(query: string): KnowledgeSearchResult[] {
    const q = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(a => a.status === 'published')
      .map(article => {
        let score = 0;
        const highlights: { field: string; snippet: string }[] = [];
        if (article.title.toLowerCase().includes(q)) { score += 10; highlights.push({ field: 'title', snippet: article.title }); }
        if (article.content.toLowerCase().includes(q)) { score += 5; highlights.push({ field: 'content', snippet: article.content.slice(0, 200) }); }
        if (article.tags.some(t => t.toLowerCase().includes(q))) { score += 3; highlights.push({ field: 'tags', snippet: article.tags.join(', ') }); }
        if (article.summary.toLowerCase().includes(q)) { score += 2; highlights.push({ field: 'summary', snippet: article.summary }); }
        return { article, score, highlights };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }
}

export const knowledgeBase = new KnowledgeBase();
