export type ListingType = 'agent' | 'template' | 'prompt' | 'workflow' | 'component';
export type ListingStatus = 'draft' | 'published' | 'archived';
export type LicenseType = 'free' | 'single' | 'team' | 'enterprise';

export interface MarketplaceListing {
  id: string;
  name: string;
  description: string;
  type: ListingType;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  downloads: number;
  author: { id: string; name: string; avatar?: string };
  version: string;
  tags: string[];
  screenshots: string[];
  features: string[];
  requirements: string[];
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceReview {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface MarketplacePurchase {
  id: string;
  listingId: string;
  userId: string;
  price: number;
  licenseType: LicenseType;
  purchasedAt: string;
}

export interface ListingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  type?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'rating' | 'downloads' | 'price' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  listings: MarketplaceListing[];
  total: number;
  page: number;
  totalPages: number;
}
