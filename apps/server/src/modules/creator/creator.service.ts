import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { creator, CreatorProfile, ContentItem, Analytics, Payout, Subscription } from '@nexora/creator';

@Injectable()
export class CreatorService {
  getProfile(userId: string): CreatorProfile {
    const profile = creator.getProfile(userId);
    if (!profile) throw new NotFoundException('Creator profile not found');
    return profile;
  }

  updateProfile(userId: string, data: Partial<CreatorProfile>): CreatorProfile {
    const profile = creator.updateProfile(userId, data);
    if (!profile) throw new NotFoundException('Creator profile not found');
    return profile;
  }

  getContent(creatorId: string): ContentItem[] {
    return creator.getCreatorContent(creatorId);
  }

  publishContent(data: Omit<ContentItem, 'id' | 'createdAt'>): ContentItem {
    return creator.publishContent(data);
  }

  updateContent(id: string, data: Partial<ContentItem>): ContentItem {
    const item = creator.updateContent(id, data);
    if (!item) throw new NotFoundException('Content not found');
    return item;
  }

  deleteContent(id: string): void {
    if (!creator.deleteContent(id)) throw new NotFoundException('Content not found');
  }

  getAnalytics(creatorId: string, period?: string): Analytics[] {
    return creator.getAnalytics(creatorId, period);
  }

  getPayouts(creatorId: string): Payout[] {
    return creator.getPayouts(creatorId);
  }

  requestPayout(creatorId: string, amount: number, method: string): Payout {
    return creator.requestPayout(creatorId, amount, method);
  }

  getSubscribers(creatorId: string): Subscription[] {
    return creator.getSubscriptions(creatorId);
  }
}
