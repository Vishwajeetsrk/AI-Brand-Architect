import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma } from '@nexora/database';
import { creator, CreatorProfile, ContentItem, Analytics, Payout, Subscription } from '@nexora/creator';

@Injectable()
export class CreatorService {
  async getProfile(userId: string): Promise<CreatorProfile> {
    const profile = creator.getProfile(userId);
    if (!profile) throw new NotFoundException('Creator profile not found');
    return profile;
  }

  async updateProfile(userId: string, data: Partial<CreatorProfile>): Promise<CreatorProfile> {
    const profile = creator.updateProfile(userId, data);
    if (!profile) throw new NotFoundException('Creator profile not found');
    return profile;
  }

  async getContent(creatorId: string): Promise<ContentItem[]> {
    return creator.getCreatorContent(creatorId);
  }

  async publishContent(data: Omit<ContentItem, 'id' | 'createdAt'>): Promise<ContentItem> {
    return creator.publishContent(data);
  }

  async updateContent(id: string, data: Partial<ContentItem>): Promise<ContentItem> {
    const item = creator.updateContent(id, data);
    if (!item) throw new NotFoundException('Content not found');
    return item;
  }

  async deleteContent(id: string): Promise<void> {
    if (!creator.deleteContent(id)) throw new NotFoundException('Content not found');
  }

  async getAnalytics(creatorId: string, period?: string): Promise<Analytics[]> {
    return creator.getAnalytics(creatorId, period);
  }

  async getPayouts(creatorId: string): Promise<Payout[]> {
    return creator.getPayouts(creatorId);
  }

  async requestPayout(creatorId: string, amount: number, method: string): Promise<Payout> {
    return creator.requestPayout(creatorId, amount, method);
  }

  async getSubscribers(creatorId: string): Promise<Subscription[]> {
    return creator.getSubscriptions(creatorId);
  }
}
