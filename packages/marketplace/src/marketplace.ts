import type {
  MarketplaceListing, MarketplaceReview, MarketplacePurchase,
  ListingCategory, SearchFilters, SearchResult, LicenseType,
} from './types';

const SEED_LISTINGS: MarketplaceListing[] = [
  { id: 'mkt-001', name: 'BrandSync Pro', description: 'AI-powered brand identity agent that generates cohesive brand guidelines, color palettes, typography systems, and brand voice across all touchpoints. Integrates with major design tools.', type: 'agent', category: 'branding', price: 49, rating: 4.8, reviewCount: 234, downloads: 12450, author: { id: 'auth-1', name: 'Nexora Labs' }, version: '2.1.0', tags: ['branding', 'identity', 'design-system', 'guidelines'], screenshots: [], features: ['Auto brand guidelines', 'Color palette generation', 'Typography pairing', 'Brand voice analysis', 'Design tool plugins', 'Multi-language support'], requirements: ['Nexora AI Engine v2+', 'Node.js 18+'], status: 'published', createdAt: '2025-09-01T00:00:00Z', updatedAt: '2026-03-15T00:00:00Z' },
  { id: 'mkt-002', name: 'ContentForge AI', description: 'Enterprise-grade content generation engine that produces SEO-optimized blog posts, articles, social copy, and marketing collateral with brand-consistent tone.', type: 'agent', category: 'content', price: 29, rating: 4.7, reviewCount: 512, downloads: 28730, author: { id: 'auth-1', name: 'Nexora Labs' }, version: '3.0.0', tags: ['content', 'writing', 'seo', 'blog', 'marketing'], screenshots: [], features: ['Long-form content generation', 'SEO optimization', 'Brand tone matching', 'Multi-channel output', 'Content calendar', 'Plagiarism check'], requirements: ['Nexora AI Engine v2+'], status: 'published', createdAt: '2025-08-15T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: 'mkt-003', name: 'SocialPulse', description: 'Automated social media management agent that schedules posts, analyzes engagement, generates platform-specific content, and suggests optimal posting times.', type: 'agent', category: 'social-media', price: 39, rating: 4.6, reviewCount: 189, downloads: 8920, author: { id: 'auth-2', name: 'SocialSync Inc' }, version: '1.8.2', tags: ['social-media', 'automation', 'scheduling', 'analytics'], screenshots: [], features: ['Auto scheduling', 'Engagement analytics', 'Platform-specific formatting', 'Hashtag optimization', 'Competitor tracking', 'Content recycling'], requirements: ['Nexora AI Engine v1.5+'], status: 'published', createdAt: '2025-10-01T00:00:00Z', updatedAt: '2026-02-20T00:00:00Z' },
  { id: 'mkt-004', name: 'SEOptimizer', description: 'Comprehensive SEO analysis and optimization agent that audits sites, suggests improvements, tracks rankings, and generates optimized content strategies.', type: 'agent', category: 'marketing', price: 59, rating: 4.9, reviewCount: 378, downloads: 15670, author: { id: 'auth-3', name: 'RankHigher AI' }, version: '2.3.1', tags: ['seo', 'marketing', 'analytics', 'optimization'], screenshots: [], features: ['Site audit', 'Keyword research', 'Rank tracking', 'Content optimization', 'Backlink analysis', 'Technical SEO'], requirements: ['Nexora AI Engine v2+', 'API key for search console'], status: 'published', createdAt: '2025-07-20T00:00:00Z', updatedAt: '2026-03-28T00:00:00Z' },
  { id: 'mkt-005', name: 'DesignMind', description: 'AI visual design assistant that creates UI mockups, brand assets, social media graphics, and presentation decks from natural language descriptions.', type: 'agent', category: 'design', price: 69, rating: 4.5, reviewCount: 456, downloads: 20340, author: { id: 'auth-4', name: 'DesignForge' }, version: '2.0.0', tags: ['design', 'ui', 'graphics', 'mockups', 'assets'], screenshots: [], features: ['UI mockup generation', 'Brand asset creation', 'Social media graphics', 'Presentation decks', 'Style transfer', 'Export to Figma/Sketch'], requirements: ['Nexora AI Engine v2+', 'GPU recommended'], status: 'published', createdAt: '2025-06-10T00:00:00Z', updatedAt: '2026-01-15T00:00:00Z' },
  { id: 'mkt-006', name: 'CopyCraft Pro', description: 'Advanced copywriting agent specializing in ad copy, email campaigns, landing pages, and sales funnels with A/B testing recommendations.', type: 'agent', category: 'content', price: 19, rating: 4.4, reviewCount: 678, downloads: 34500, author: { id: 'auth-5', name: 'CopyLab' }, version: '1.5.0', tags: ['copywriting', 'ads', 'email', 'sales', 'conversion'], screenshots: [], features: ['Ad copy generation', 'Email sequence writing', 'Landing page copy', 'A/B test suggestions', 'Conversion optimization', 'Multi-variant testing'], requirements: [], status: 'published', createdAt: '2025-11-05T00:00:00Z', updatedAt: '2026-02-10T00:00:00Z' },
  { id: 'mkt-007', name: 'DataViz AI', description: 'Transforms raw data into beautiful, interactive visualizations and dashboards. Supports multiple data sources and export formats.', type: 'agent', category: 'analytics', price: 44, rating: 4.3, reviewCount: 156, downloads: 6780, author: { id: 'auth-6', name: 'DataPulse' }, version: '1.2.0', tags: ['data', 'visualization', 'analytics', 'dashboards', 'charts'], screenshots: [], features: ['Auto chart selection', 'Interactive dashboards', 'Multi-source import', 'Real-time updates', 'Export to PNG/SVG/PDF', 'Custom themes'], requirements: ['Nexora AI Engine v1.5+'], status: 'published', createdAt: '2025-12-01T00:00:00Z', updatedAt: '2026-03-05T00:00:00Z' },
  { id: 'mkt-008', name: 'EmailFlow', description: 'Intelligent email campaign agent that designs, personalizes, and optimizes email marketing campaigns with predictive send-time optimization.', type: 'agent', category: 'marketing', price: 34, rating: 4.6, reviewCount: 223, downloads: 11230, author: { id: 'auth-2', name: 'SocialSync Inc' }, version: '2.1.0', tags: ['email', 'marketing', 'campaigns', 'automation'], screenshots: [], features: ['Campaign design', 'Personalization engine', 'Send-time optimization', 'A/B testing', 'Analytics dashboard', 'List segmentation'], requirements: ['Nexora AI Engine v2+', 'Email service API key'], status: 'published', createdAt: '2025-09-15T00:00:00Z', updatedAt: '2026-04-02T00:00:00Z' },
  { id: 'mkt-009', name: 'MarketSense', description: 'Market research agent that analyzes trends, competitor strategies, customer sentiment, and provides actionable business intelligence.', type: 'agent', category: 'analytics', price: 54, rating: 4.7, reviewCount: 145, downloads: 5430, author: { id: 'auth-7', name: 'Intellivest AI' }, version: '1.0.0', tags: ['research', 'market', 'intelligence', 'competitor', 'trends'], screenshots: [], features: ['Trend analysis', 'Competitor monitoring', 'Sentiment analysis', 'SWOT generation', 'Industry reports', 'Predictive insights'], requirements: ['Nexora AI Engine v2+'], status: 'published', createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-03-20T00:00:00Z' },
  { id: 'mkt-010', name: 'CodeWeaver', description: 'AI code generation assistant that writes, reviews, and refactors code across multiple languages. Supports context-aware completions and full project scaffolding.', type: 'agent', category: 'development', price: 0, rating: 4.8, reviewCount: 892, downloads: 56780, author: { id: 'auth-1', name: 'Nexora Labs' }, version: '3.2.0', tags: ['code', 'development', 'generation', 'refactoring'], screenshots: [], features: ['Multi-language support', 'Code review', 'Refactoring', 'Project scaffolding', 'Test generation', 'Documentation generation'], requirements: ['Nexora AI Engine v2+'], status: 'published', createdAt: '2025-05-01T00:00:00Z', updatedAt: '2026-04-05T00:00:00Z' },
  { id: 'mkt-011', name: 'VoiceSync', description: 'Voice and audio processing agent that generates voiceovers, transcribes audio, applies voice modulation, and creates podcast-ready content.', type: 'agent', category: 'media', price: 24, rating: 4.2, reviewCount: 98, downloads: 3450, author: { id: 'auth-8', name: 'AudioCraft' }, version: '1.1.0', tags: ['voice', 'audio', 'transcription', 'voiceover', 'podcast'], screenshots: [], features: ['Text-to-speech', 'Audio transcription', 'Voice cloning', 'Accent modulation', 'Podcast editing', 'Multi-track mixing'], requirements: ['Nexora AI Engine v1.5+', 'GPU recommended'], status: 'published', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-03-25T00:00:00Z' },
  { id: 'mkt-012', name: 'AnalyticaGPT', description: 'Business analytics agent that connects to your data sources, generates insights, forecasts trends, and produces executive-ready reports in minutes.', type: 'agent', category: 'analytics', price: 49, rating: 4.5, reviewCount: 267, downloads: 9870, author: { id: 'auth-9', name: 'DataMinds' }, version: '2.0.0', tags: ['analytics', 'business', 'reports', 'forecasting', 'insights'], screenshots: [], features: ['Data source connectors', 'Insight generation', 'Trend forecasting', 'Executive reports', 'Anomaly detection', 'Custom dashboards'], requirements: ['Nexora AI Engine v2+', 'Database or API access'], status: 'published', createdAt: '2025-10-20T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z' },
  { id: 'mkt-013', name: 'PixelForge', description: 'AI image generation and editing agent that creates stunning visuals from prompts, edits existing images, and maintains brand consistency across all visuals.', type: 'agent', category: 'design', price: 39, rating: 4.6, reviewCount: 534, downloads: 28900, author: { id: 'auth-4', name: 'DesignForge' }, version: '2.4.0', tags: ['image', 'generation', 'editing', 'design', 'visuals'], screenshots: [], features: ['Text-to-image', 'Image editing', 'Style transfer', 'Brand-consistent visuals', 'Batch processing', 'High-resolution export'], requirements: ['Nexora AI Engine v2+', 'GPU required'], status: 'published', createdAt: '2025-08-01T00:00:00Z', updatedAt: '2026-03-30T00:00:00Z' },
  { id: 'mkt-014', name: 'AdOptimize', description: 'Ad campaign optimization agent that manages budgets, targets audiences, creates ad variants, and maximizes ROAS across Google, Meta, and LinkedIn.', type: 'agent', category: 'marketing', price: 74, rating: 4.7, reviewCount: 189, downloads: 7650, author: { id: 'auth-10', name: 'AdVantage AI' }, version: '1.3.0', tags: ['ads', 'marketing', 'optimization', 'ppc', 'roas'], screenshots: [], features: ['Cross-platform management', 'Budget optimization', 'Audience targeting', 'Ad variant creation', 'ROAS tracking', 'Automated bidding'], requirements: ['Nexora AI Engine v2+', 'Ad platform API keys'], status: 'published', createdAt: '2025-11-20T00:00:00Z', updatedAt: '2026-02-28T00:00:00Z' },
  { id: 'mkt-015', name: 'Workflow Automator', description: 'Visual workflow builder template that connects AI agents, APIs, and services into automated pipelines with drag-and-drop simplicity.', type: 'template', category: 'productivity', price: 15, rating: 4.3, reviewCount: 78, downloads: 2340, author: { id: 'auth-1', name: 'Nexora Labs' }, version: '1.0.0', tags: ['workflow', 'automation', 'integration', 'pipeline'], screenshots: [], features: ['Drag-and-drop builder', '100+ integrations', 'Conditional logic', 'Error handling', 'Scheduling', 'Monitoring dashboard'], requirements: [], status: 'published', createdAt: '2026-01-05T00:00:00Z', updatedAt: '2026-02-15T00:00:00Z' },
];

const SEED_CATEGORIES: ListingCategory[] = [
  { id: 'cat-branding', name: 'Branding', description: 'Brand identity, guidelines, and logo agents', icon: 'Palette', count: 2 },
  { id: 'cat-content', name: 'Content', description: 'Content generation and copywriting agents', icon: 'FileText', count: 2 },
  { id: 'cat-marketing', name: 'Marketing', description: 'Marketing automation and campaign agents', icon: 'Megaphone', count: 3 },
  { id: 'cat-design', name: 'Design', description: 'Visual design and image generation agents', icon: 'Wand2', count: 2 },
  { id: 'cat-social-media', name: 'Social Media', description: 'Social media management agents', icon: 'Share2', count: 1 },
  { id: 'cat-analytics', name: 'Analytics', description: 'Data analytics and business intelligence', icon: 'BarChart3', count: 3 },
  { id: 'cat-development', name: 'Development', description: 'Code generation and dev tools', icon: 'Terminal', count: 1 },
  { id: 'cat-media', name: 'Media', description: 'Audio, voice, and media processing', icon: 'Music', count: 1 },
  { id: 'cat-productivity', name: 'Productivity', description: 'Workflow automation and productivity', icon: 'Zap', count: 1 },
];

export class MarketplaceEngine {
  private listings: Map<string, MarketplaceListing> = new Map();
  private reviews: Map<string, MarketplaceReview[]> = new Map();
  private purchases: Map<string, MarketplacePurchase[]> = new Map();
  private categories: Map<string, ListingCategory> = new Map();

  constructor() {
    for (const l of SEED_LISTINGS) this.listings.set(l.id, l);
    for (const c of SEED_CATEGORIES) this.categories.set(c.id, c);
    this.seedReviews();
    this.seedPurchases();
  }

  private seedReviews() {
    const reviewData: Record<string, { user: string; rating: number; content: string }[]> = {
      'mkt-001': [
        { user: 'Alice M.', rating: 5, content: 'Transformed our brand identity process. Highly recommended!' },
        { user: 'Bob K.', rating: 4, content: 'Great tool, needs more design tool integrations.' },
        { user: 'Carol S.', rating: 5, content: 'The color palette generation is magical.' },
      ],
      'mkt-004': [
        { user: 'Dan W.', rating: 5, content: 'Best SEO agent on the market. Our traffic doubled.' },
        { user: 'Eva L.', rating: 5, content: 'Comprehensive audit capabilities.' },
      ],
      'mkt-010': [
        { user: 'Frank T.', rating: 5, content: 'Incredible code quality. Saves hours daily.' },
        { user: 'Grace P.', rating: 4, content: 'Great but needs more language support.' },
        { user: 'Hank J.', rating: 5, content: 'The refactoring suggestions are spot-on.' },
        { user: 'Ivy N.', rating: 5, content: 'Best free agent in the marketplace!' },
      ],
    };
    for (const [listingId, reviews] of Object.entries(reviewData)) {
      this.reviews.set(listingId, reviews.map((r, i) => ({
        id: `rev-${listingId}-${i + 1}`, listingId, userId: `user-${i}`,
        userName: r.user, rating: r.rating, content: r.content,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      })));
    }
  }

  private seedPurchases() {
    const purchaseData: { listingId: string; userId: string; price: number; license: LicenseType }[] = [
      { listingId: 'mkt-001', userId: 'user-demo', price: 49, license: 'single' },
      { listingId: 'mkt-004', userId: 'user-demo', price: 59, license: 'team' },
      { listingId: 'mkt-010', userId: 'user-demo', price: 0, license: 'free' },
      { listingId: 'mkt-013', userId: 'user-demo', price: 39, license: 'single' },
    ];
    for (const p of purchaseData) {
      const existing = this.purchases.get(p.userId) || [];
      existing.push({
        id: `pur-${p.userId}-${p.listingId}`, listingId: p.listingId,
        userId: p.userId, price: p.price, licenseType: p.license,
        purchasedAt: new Date().toISOString(),
      });
      this.purchases.set(p.userId, existing);
    }
  }

  getCategories(): ListingCategory[] {
    return Array.from(this.categories.values());
  }

  getListings(filters: SearchFilters = {}): SearchResult {
    let result = Array.from(this.listings.values())
      .filter(l => l.status === 'published');

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags.some(t => t.includes(q))
      );
    }
    if (filters.category) {
      result = result.filter(l => l.category === filters.category);
    }
    if (filters.type) {
      result = result.filter(l => l.type === filters.type);
    }
    if (filters.minPrice !== undefined) {
      result = result.filter(l => l.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(l => l.price <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined) {
      result = result.filter(l => l.rating >= filters.minRating!);
    }

    const sortBy = filters.sortBy || 'rating';
    const sortOrder = filters.sortOrder || 'desc';
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'rating') cmp = a.rating - b.rating;
      else if (sortBy === 'downloads') cmp = a.downloads - b.downloads;
      else if (sortBy === 'price') cmp = a.price - b.price;
      else if (sortBy === 'newest') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    result = result.slice(start, start + limit);

    return { listings: result, total, page, totalPages };
  }

  getListing(id: string): MarketplaceListing | undefined {
    return this.listings.get(id);
  }

  createListing(listing: Omit<MarketplaceListing, 'id' | 'createdAt' | 'updatedAt'>): MarketplaceListing {
    const newListing: MarketplaceListing = {
      ...listing,
      id: `mkt-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.listings.set(newListing.id, newListing);
    return newListing;
  }

  purchaseListing(listingId: string, userId: string, licenseType: LicenseType = 'single'): MarketplacePurchase | null {
    const listing = this.listings.get(listingId);
    if (!listing || listing.status !== 'published') return null;

    const userPurchases = this.purchases.get(userId) || [];
    const alreadyOwned = userPurchases.some(p => p.listingId === listingId);
    if (alreadyOwned) return null;

    const purchase: MarketplacePurchase = {
      id: `pur-${crypto.randomUUID().slice(0, 8)}`, listingId, userId,
      price: listing.price, licenseType, purchasedAt: new Date().toISOString(),
    };
    userPurchases.push(purchase);
    this.purchases.set(userId, userPurchases);
    listing.downloads += 1;
    return purchase;
  }

  getUserPurchases(userId: string): MarketplacePurchase[] {
    return this.purchases.get(userId) || [];
  }

  getReviews(listingId: string): MarketplaceReview[] {
    return this.reviews.get(listingId) || [];
  }

  addReview(listingId: string, userId: string, userName: string, rating: number, content: string): MarketplaceReview | null {
    const listing = this.listings.get(listingId);
    if (!listing) return null;

    const review: MarketplaceReview = {
      id: `rev-${crypto.randomUUID().slice(0, 8)}`, listingId, userId,
      userName, rating, content, createdAt: new Date().toISOString(),
    };
    const existing = this.reviews.get(listingId) || [];
    existing.push(review);
    this.reviews.set(listingId, existing);
    listing.reviewCount = existing.length;
    listing.rating = existing.reduce((s, r) => s + r.rating, 0) / existing.length;
    return review;
  }

  getFeatured(): MarketplaceListing[] {
    return Array.from(this.listings.values())
      .filter(l => l.status === 'published')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }

  getTopRated(): MarketplaceListing[] {
    return Array.from(this.listings.values())
      .filter(l => l.status === 'published' && l.reviewCount >= 10)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }

  getBestSelling(): MarketplaceListing[] {
    return Array.from(this.listings.values())
      .filter(l => l.status === 'published')
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 8);
  }
}

export const marketplace = new MarketplaceEngine();
