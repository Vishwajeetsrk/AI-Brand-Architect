import { Injectable } from '@nestjs/common';
import { prisma } from '@nexora/database';

interface ListingCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  authorId: string;
  authorName: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MarketplaceReview {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: Date;
}

interface MarketplacePurchase {
  id: string;
  listingId: string;
  userId: string;
  purchasedAt: Date;
}

interface SearchFilters {
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

const categories: ListingCategory[] = [
  { id: 'templates', name: 'Templates', slug: 'templates', icon: 'template', count: 24 },
  { id: 'plugins', name: 'Plugins', slug: 'plugins', icon: 'plugin', count: 18 },
  { id: 'themes', name: 'Themes', slug: 'themes', icon: 'theme', count: 12 },
];

let listings: MarketplaceListing[] = [
  { id: 'lst-1', title: 'Brand Identity Kit', description: 'Complete brand identity package', price: 49, categoryId: 'templates', categoryName: 'Templates', authorId: 'author-1', authorName: 'DesignPro', rating: 4.8, reviewCount: 32, downloads: 1200, featured: true, tags: ['brand', 'identity'], createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01') },
  { id: 'lst-2', title: 'Social Media Bundle', description: 'Social media post templates', price: 29, categoryId: 'templates', categoryName: 'Templates', authorId: 'author-2', authorName: 'ContentCraft', rating: 4.5, reviewCount: 18, downloads: 850, featured: true, tags: ['social', 'media'], createdAt: new Date('2025-02-15'), updatedAt: new Date('2025-05-20') },
];

let reviews: MarketplaceReview[] = [];

let purchases: MarketplacePurchase[] = [];

@Injectable()
export class MarketplaceService {
  getCategories(): ListingCategory[] {
    return categories;
  }

  search(filters: SearchFilters) {
    let result = [...listings];
    if (filters.category) result = result.filter(l => l.categoryId === filters.category);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }
    if (filters.minPrice !== undefined) result = result.filter(l => l.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) result = result.filter(l => l.price <= filters.maxPrice!);
    if (filters.sortBy === 'price') result.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (filters.sortBy === 'popular') result.sort((a, b) => b.downloads - a.downloads);
    else result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return result;
  }

  getListing(id: string): MarketplaceListing | null {
    const listing = listings.find(l => l.id === id);
    if (!listing) return null;
    return listing;
  }

  async createListing(data: Omit<MarketplaceListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<MarketplaceListing | null> {
    const user = await prisma.user.findUnique({ where: { id: data.authorId } });
    if (!user) return null;
    const listing: MarketplaceListing = {
      ...data,
      id: `lst-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    listings.push(listing);
    return listing;
  }

  purchase(listingId: string, userId: string): MarketplacePurchase | null {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return null;
    const existing = purchases.find(p => p.listingId === listingId && p.userId === userId);
    if (existing) return null;
    const purchase: MarketplacePurchase = {
      id: `pur-${Date.now()}`,
      listingId,
      userId,
      purchasedAt: new Date(),
    };
    purchases.push(purchase);
    listing.downloads++;
    return purchase;
  }

  getUserPurchases(userId: string): MarketplacePurchase[] {
    return purchases.filter(p => p.userId === userId);
  }

  getReviews(listingId: string): MarketplaceReview[] | null {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return null;
    return reviews.filter(r => r.listingId === listingId);
  }

  async addReview(listingId: string, userId: string, userName: string, rating: number, content: string): Promise<MarketplaceReview | null> {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return null;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    const review: MarketplaceReview = {
      id: `rev-${Date.now()}`,
      listingId,
      userId,
      userName,
      rating,
      content,
      createdAt: new Date(),
    };
    reviews.push(review);
    const listingReviews = reviews.filter(r => r.listingId === listingId);
    listing.rating = listingReviews.reduce((s, r) => s + r.rating, 0) / listingReviews.length;
    listing.reviewCount = listingReviews.length;
    return review;
  }

  getFeatured(): MarketplaceListing[] {
    return listings.filter(l => l.featured);
  }

  getTopRated(): MarketplaceListing[] {
    return [...listings].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }

  getBestSelling(): MarketplaceListing[] {
    return [...listings].sort((a, b) => b.downloads - a.downloads).slice(0, 10);
  }
}
