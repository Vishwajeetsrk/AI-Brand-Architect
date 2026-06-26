import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { MarketplaceEngine, marketplace, SearchFilters, ListingCategory, MarketplaceListing, MarketplaceReview, MarketplacePurchase } from '@nexora/marketplace';

@Injectable()
export class MarketplaceService {
  private engine: MarketplaceEngine;

  constructor() {
    this.engine = marketplace;
  }

  getCategories(): ListingCategory[] {
    return this.engine.getCategories();
  }

  search(filters: SearchFilters) {
    return this.engine.getListings(filters);
  }

  getListing(id: string): MarketplaceListing {
    const listing = this.engine.getListing(id);
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  createListing(data: Omit<MarketplaceListing, 'id' | 'createdAt' | 'updatedAt'>): MarketplaceListing {
    return this.engine.createListing(data);
  }

  purchase(listingId: string, userId: string): MarketplacePurchase {
    const result = this.engine.purchaseListing(listingId, userId);
    if (!result) {
      const listing = this.engine.getListing(listingId);
      if (!listing) throw new NotFoundException('Listing not found');
      throw new ConflictException('Already purchased this listing');
    }
    return result;
  }

  getUserPurchases(userId: string): MarketplacePurchase[] {
    return this.engine.getUserPurchases(userId);
  }

  getReviews(listingId: string): MarketplaceReview[] {
    const listing = this.engine.getListing(listingId);
    if (!listing) throw new NotFoundException('Listing not found');
    return this.engine.getReviews(listingId);
  }

  addReview(listingId: string, userId: string, userName: string, rating: number, content: string): MarketplaceReview {
    const result = this.engine.addReview(listingId, userId, userName, rating, content);
    if (!result) throw new NotFoundException('Listing not found');
    return result;
  }

  getFeatured(): MarketplaceListing[] {
    return this.engine.getFeatured();
  }

  getTopRated(): MarketplaceListing[] {
    return this.engine.getTopRated();
  }

  getBestSelling(): MarketplaceListing[] {
    return this.engine.getBestSelling();
  }
}
