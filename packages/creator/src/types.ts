export type ContentType = 'template' | 'prompt' | 'agent' | 'workflow' | 'design' | 'guide';
export type ContentStatus = 'draft' | 'published';
export type PayoutStatus = 'pending' | 'processing' | 'completed';
export type SubTier = 'free' | 'premium' | 'pro';

export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  avatar: string;
  specialties: string[];
  socialLinks: { platform: string; url: string }[];
  rating: number;
  totalSales: number;
  joinedAt: string;
}

export interface ContentItem {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  type: ContentType;
  category: string;
  price: number;
  fileUrl: string;
  previewUrl: string;
  downloads: number;
  rating: number;
  tags: string[];
  status: ContentStatus;
  createdAt: string;
}

export interface Analytics {
  id: string;
  creatorId: string;
  period: string;
  totalViews: number;
  totalDownloads: number;
  totalRevenue: number;
  conversionRate: number;
  topContent: { contentId: string; title: string; views: number; downloads: number; revenue: number }[];
}

export interface Payout {
  id: string;
  creatorId: string;
  amount: number;
  status: PayoutStatus;
  method: string;
  requestedAt: string;
  completedAt?: string;
}

export interface Subscription {
  id: string;
  creatorId: string;
  subscriberId: string;
  tier: SubTier;
  benefits: string[];
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}
