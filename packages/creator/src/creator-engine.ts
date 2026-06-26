import { CreatorProfile, ContentItem, Analytics, Payout, Subscription, ContentStatus, ContentType, PayoutStatus, SubTier } from './types';

export class CreatorEngine {
  private profiles: Map<string, CreatorProfile> = new Map();
  private contents: Map<string, ContentItem> = new Map();
  private analytics: Map<string, Analytics[]> = new Map();
  private payouts: Map<string, Payout[]> = new Map();
  private subscriptions: Map<string, Subscription[]> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    const profiles: CreatorProfile[] = [
      { id: 'cr-001', userId: 'u-001', displayName: 'Alex Rivera', bio: 'Brand strategist & designer creating premium templates and agents.', avatar: '', specialties: ['Branding', 'Design Systems', 'UI/UX'], socialLinks: [{ platform: 'twitter', url: 'https://x.com/alexrivera' }], rating: 4.8, totalSales: 3420, joinedAt: '2025-01-15T00:00:00Z' },
      { id: 'cr-002', userId: 'u-002', displayName: 'Priya Sharma', bio: 'AI prompt engineer crafting high-converting marketing workflows.', avatar: '', specialties: ['Marketing', 'Copywriting', 'AI Prompts'], socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com/in/priyasharma' }], rating: 4.6, totalSales: 2180, joinedAt: '2025-03-01T00:00:00Z' },
      { id: 'cr-003', userId: 'u-003', displayName: 'Marcus Chen', bio: 'Full-stack developer building AI agents and automation workflows.', avatar: '', specialties: ['Development', 'Automation', 'Agents'], socialLinks: [{ platform: 'github', url: 'https://github.com/marcuschen' }], rating: 4.9, totalSales: 5670, joinedAt: '2024-11-20T00:00:00Z' },
      { id: 'cr-004', userId: 'u-004', displayName: 'Sofia Patel', bio: 'Visual designer specializing in brand guides and design systems.', avatar: '', specialties: ['Visual Design', 'Brand Guidelines', 'Illustration'], socialLinks: [{ platform: 'dribbble', url: 'https://dribbble.com/sofiapatel' }], rating: 4.7, totalSales: 1890, joinedAt: '2025-06-10T00:00:00Z' },
    ];
    profiles.forEach(p => this.profiles.set(p.id, p));

    const contents: ContentItem[] = [
      { id: 'c-001', creatorId: 'cr-001', title: 'Brand Identity Pack Pro', description: 'Complete brand identity system with logo variations, color palettes, typography scales, and brand guidelines template.', type: 'template', category: 'branding', price: 49, fileUrl: '/files/brand-pack-pro.zip', previewUrl: '/previews/brand-pack.png', downloads: 1240, rating: 4.8, tags: ['branding', 'identity', 'design-system'], status: 'published', createdAt: '2025-02-10T00:00:00Z' },
      { id: 'c-002', creatorId: 'cr-001', title: 'UI Component Library', description: '200+ reusable UI components built with React and Tailwind.', type: 'template', category: 'development', price: 79, fileUrl: '/files/ui-lib.zip', previewUrl: '/previews/ui-lib.png', downloads: 890, rating: 4.7, tags: ['ui', 'react', 'tailwind'], status: 'published', createdAt: '2025-03-15T00:00:00Z' },
      { id: 'c-003', creatorId: 'cr-002', title: 'Marketing Funnel Prompts', description: '50 high-converting AI prompts for email, social, ad copy, and landing pages.', type: 'prompt', category: 'marketing', price: 19, fileUrl: '/files/funnel-prompts.json', previewUrl: '/previews/funnel.png', downloads: 3450, rating: 4.5, tags: ['marketing', 'copywriting', 'prompts'], status: 'published', createdAt: '2025-04-01T00:00:00Z' },
      { id: 'c-004', creatorId: 'cr-002', title: 'SEO Content Agent', description: 'AI agent that researches keywords and generates SEO-optimized articles.', type: 'agent', category: 'marketing', price: 39, fileUrl: '/files/seo-agent.json', previewUrl: '/previews/seo-agent.png', downloads: 670, rating: 4.6, tags: ['seo', 'content', 'agent'], status: 'published', createdAt: '2025-05-12T00:00:00Z' },
      { id: 'c-005', creatorId: 'cr-003', title: 'Social Media Automator', description: 'Automated workflow for scheduling, generating, and posting social content across platforms.', type: 'workflow', category: 'automation', price: 59, fileUrl: '/files/social-automator.json', previewUrl: '/previews/social-auto.png', downloads: 1230, rating: 4.9, tags: ['social', 'automation', 'workflow'], status: 'published', createdAt: '2025-01-20T00:00:00Z' },
      { id: 'c-006', creatorId: 'cr-003', title: 'Brand Analyzer Agent', description: 'AI agent that audits brand consistency across digital assets.', type: 'agent', category: 'branding', price: 44, fileUrl: '/files/brand-analyzer.json', previewUrl: '/previews/brand-analyzer.png', downloads: 560, rating: 4.8, tags: ['branding', 'analysis', 'agent'], status: 'published', createdAt: '2025-06-01T00:00:00Z' },
      { id: 'c-007', creatorId: 'cr-004', title: 'Brand Guidelines Template', description: 'Modern brand guidelines template with 30+ pages covering every aspect of brand identity.', type: 'design', category: 'branding', price: 34, fileUrl: '/files/guidelines.fig', previewUrl: '/previews/guidelines.png', downloads: 2100, rating: 4.7, tags: ['brand-guidelines', 'design', 'figma'], status: 'published', createdAt: '2025-07-05T00:00:00Z' },
      { id: 'c-008', creatorId: 'cr-004', title: 'Illustration System', description: 'Modular illustration system with 100+ characters, objects, and backgrounds.', type: 'design', category: 'design', price: 69, fileUrl: '/files/illustration-system.zip', previewUrl: '/previews/illustrations.png', downloads: 430, rating: 4.5, tags: ['illustration', 'design-system', 'assets'], status: 'published', createdAt: '2025-08-18T00:00:00Z' },
      { id: 'c-009', creatorId: 'cr-001', title: 'Brand Voice Guide', description: 'Step-by-step guide to defining and maintaining a consistent brand voice.', type: 'guide', category: 'branding', price: 14, fileUrl: '/files/brand-voice-guide.pdf', previewUrl: '/previews/voice-guide.png', downloads: 3890, rating: 4.6, tags: ['brand-voice', 'guide', 'copy'], status: 'published', createdAt: '2025-04-22T00:00:00Z' },
      { id: 'c-010', creatorId: 'cr-003', title: 'DevOps Pipeline Template', description: 'CI/CD pipeline templates for automated deployment with monitoring and alerts.', type: 'template', category: 'development', price: 29, fileUrl: '/files/devops-pipeline.zip', previewUrl: '/previews/devops.png', downloads: 780, rating: 4.4, tags: ['devops', 'ci-cd', 'deployment'], status: 'draft', createdAt: '2025-09-01T00:00:00Z' },
    ];
    contents.forEach(c => this.contents.set(c.id, c));

    const creatorIds = ['cr-001', 'cr-002', 'cr-003', 'cr-004'];
    creatorIds.forEach(cid => {
      const cItems = contents.filter(c => c.creatorId === cid);
      const totalViews = cItems.reduce((s, c) => s + c.downloads * 4, 0);
      const totalDownloads = cItems.reduce((s, c) => s + c.downloads, 0);
      const totalRevenue = cItems.reduce((s, c) => s + c.price * c.downloads * 0.7, 0);
      const analytics: Analytics = {
        id: `a-${cid}`,
        creatorId: cid,
        period: '2025-09',
        totalViews,
        totalDownloads,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        conversionRate: totalViews > 0 ? Math.round((totalDownloads / totalViews) * 10000) / 100 : 0,
        topContent: cItems.slice(0, 3).map(c => ({
          contentId: c.id,
          title: c.title,
          views: c.downloads * 4,
          downloads: c.downloads,
          revenue: Math.round(c.price * c.downloads * 0.7 * 100) / 100,
        })),
      };
      this.analytics.set(cid, [analytics]);
    });
  }

  getProfile(userId: string): CreatorProfile | undefined {
    return Array.from(this.profiles.values()).find(p => p.userId === userId);
  }

  getProfileById(creatorId: string): CreatorProfile | undefined {
    return this.profiles.get(creatorId);
  }

  updateProfile(userId: string, data: Partial<CreatorProfile>): CreatorProfile | undefined {
    const profile = Array.from(this.profiles.values()).find(p => p.userId === userId);
    if (!profile) return undefined;
    Object.assign(profile, data);
    return profile;
  }

  getCreatorContent(creatorId: string): ContentItem[] {
    return Array.from(this.contents.values()).filter(c => c.creatorId === creatorId);
  }

  getContent(id: string): ContentItem | undefined {
    return this.contents.get(id);
  }

  publishContent(data: Omit<ContentItem, 'id' | 'createdAt'>): ContentItem {
    const item: ContentItem = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...data };
    this.contents.set(item.id, item);
    return item;
  }

  updateContent(id: string, data: Partial<ContentItem>): ContentItem | undefined {
    const item = this.contents.get(id);
    if (!item) return undefined;
    Object.assign(item, data);
    return item;
  }

  deleteContent(id: string): boolean {
    return this.contents.delete(id);
  }

  getAnalytics(creatorId: string, period?: string): Analytics[] {
    const records = this.analytics.get(creatorId) || [];
    return period ? records.filter(a => a.period === period) : records;
  }

  getPayouts(creatorId: string): Payout[] {
    return this.payouts.get(creatorId) || [];
  }

  requestPayout(creatorId: string, amount: number, method: string): Payout {
    const payout: Payout = {
      id: crypto.randomUUID(), creatorId, amount, status: 'pending',
      method, requestedAt: new Date().toISOString(),
    };
    const payouts = this.payouts.get(creatorId) || [];
    payouts.push(payout);
    this.payouts.set(creatorId, payouts);
    return payout;
  }

  getSubscriptions(creatorId: string): Subscription[] {
    return this.subscriptions.get(creatorId) || [];
  }

  addSubscriber(creatorId: string, subscriberId: string, tier: SubTier): Subscription {
    const sub: Subscription = {
      id: crypto.randomUUID(), creatorId, subscriberId, tier,
      benefits: tier === 'pro' ? ['Early access', 'Custom requests', 'Priority support', 'Exclusive content'] :
                tier === 'premium' ? ['Early access', 'Exclusive content'] : ['Basic content'],
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      autoRenew: true,
    };
    const subs = this.subscriptions.get(creatorId) || [];
    subs.push(sub);
    this.subscriptions.set(creatorId, subs);
    return sub;
  }
}

export const creator = new CreatorEngine();
