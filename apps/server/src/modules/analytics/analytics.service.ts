import { Injectable } from '@nestjs/common';
import { AnalyticsEngine, analytics } from '@nexora/analytics';

@Injectable()
export class AnalyticsService {
  private engine: AnalyticsEngine;

  constructor() {
    this.engine = analytics;
  }

  async getDashboardMetrics() {
    return this.engine.generateReport({
      name: 'Brand Performance',
      metrics: ['brand_health', 'engagement', 'conversion', 'traffic', 'sentiment'],
      dateRange: '30d',
    });
  }

  async getBrandHealth(brandId: string) {
    return this.engine.calculateBrandHealth({
      mentions: 15000,
      sentiment: 72,
      engagement: 45000,
      loyalty: 68,
    });
  }

  async getEngagementMetrics() {
    return this.engine.analyzeEngagement([
      { type: 'like', count: 25000, channel: 'social' },
      { type: 'share', count: 12000, channel: 'social' },
      { type: 'comment', count: 8000, channel: 'social' },
      { type: 'click', count: 45000, channel: 'email' },
    ]);
  }
}
