import { Injectable, Logger } from '@nestjs/common';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: 'page_view' | 'click' | 'conversion' | 'error' | 'custom';
  eventName: string;
  properties: Record<string, any>;
  sessionId: string;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
    screen: string;
  };
  location: {
    country: string;
    city: string;
    ip: string;
  };
  timestamp: Date;
}

export interface AnalyticsMetric {
  id: string;
  userId: string;
  metricType: 'page_views' | 'unique_visitors' | 'bounce_rate' | 'conversion_rate' | 'avg_session_duration';
  value: number;
  period: 'hour' | 'day' | 'week' | 'month' | 'year';
  periodStart: Date;
  periodEnd: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface AnalyticsReport {
  id: string;
  userId: string;
  name: string;
  type: 'traffic' | 'conversion' | 'user_behavior' | 'performance' | 'custom';
  dateRange: {
    start: Date;
    end: Date;
  };
  filters: Record<string, any>;
  data: any[];
  insights: string[];
  recommendations: string[];
  generatedAt: Date;
}

export interface UserBehavior {
  userId: string;
  sessionId: string;
  pageViews: Array<{
    page: string;
    timestamp: Date;
    duration: number;
    scrollDepth: number;
  }>;
  events: Array<{
    type: string;
    target: string;
    timestamp: Date;
    properties: Record<string, any>;
  }>;
  journey: Array<{
    step: number;
    page: string;
    action: string;
    timestamp: Date;
  }>;
  totalDuration: number;
  totalPages: number;
  converted: boolean;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  private events: Map<string, AnalyticsEvent[]> = new Map();
  private metrics: Map<string, AnalyticsMetric[]> = new Map();
  private reports: Map<string, AnalyticsReport> = new Map();
  private behaviors: Map<string, UserBehavior> = new Map();

  constructor() {}

  // Event Tracking
  async trackEvent(userId: string, eventData: Partial<AnalyticsEvent>): Promise<AnalyticsEvent> {
    this.logger.log(`Tracking event: ${eventData.eventName}`);
    
    const event: AnalyticsEvent = {
      id: Date.now().toString(),
      userId,
      eventType: eventData.eventType || 'custom',
      eventName: eventData.eventName || 'unknown',
      properties: eventData.properties || {},
      sessionId: eventData.sessionId || 'unknown',
      deviceInfo: eventData.deviceInfo || {
        browser: 'unknown',
        os: 'unknown',
        device: 'unknown',
        screen: 'unknown',
      },
      location: eventData.location || {
        country: 'unknown',
        city: 'unknown',
        ip: 'unknown',
      },
      timestamp: new Date(),
    };

    const userEvents = this.events.get(userId) || [];
    userEvents.push(event);
    this.events.set(userId, userEvents);

    // Update user behavior
    await this.updateUserBehavior(userId, event);

    return event;
  }

  async trackPageView(userId: string, page: string, sessionId: string, duration: number = 0): Promise<AnalyticsEvent> {
    return this.trackEvent(userId, {
      eventType: 'page_view',
      eventName: 'page_view',
      properties: { page, duration },
      sessionId,
    });
  }

  async trackClick(userId: string, target: string, page: string, sessionId: string): Promise<AnalyticsEvent> {
    return this.trackEvent(userId, {
      eventType: 'click',
      eventName: 'element_click',
      properties: { target, page },
      sessionId,
    });
  }

  async trackConversion(userId: string, conversionType: string, value: number, sessionId: string): Promise<AnalyticsEvent> {
    return this.trackEvent(userId, {
      eventType: 'conversion',
      eventName: conversionType,
      properties: { value },
      sessionId,
    });
  }

  // Metrics Calculation
  async calculateMetrics(userId: string, period: 'hour' | 'day' | 'week' | 'month' | 'year' = 'day'): Promise<AnalyticsMetric[]> {
    this.logger.log(`Calculating metrics for user: ${userId}, period: ${period}`);
    
    const userEvents = this.events.get(userId) || [];
    const now = new Date();
    const periodStart = this.getPeriodStart(now, period);
    const periodEnd = now;

    const periodEvents = userEvents.filter(e => 
      e.timestamp >= periodStart && e.timestamp <= periodEnd
    );

    const metrics: AnalyticsMetric[] = [];

    // Page views
    const pageViews = periodEvents.filter(e => e.eventType === 'page_view').length;
    metrics.push({
      id: Date.now().toString(),
      userId,
      metricType: 'page_views',
      value: pageViews,
      period,
      periodStart,
      periodEnd,
      metadata: {},
      createdAt: new Date(),
    });

    // Unique visitors (unique sessions)
    const uniqueSessions = new Set(periodEvents.map(e => e.sessionId)).size;
    metrics.push({
      id: (Date.now() + 1).toString(),
      userId,
      metricType: 'unique_visitors',
      value: uniqueSessions,
      period,
      periodStart,
      periodEnd,
      metadata: {},
      createdAt: new Date(),
    });

    // Bounce rate (sessions with only 1 page view)
    const sessionPageViews = new Map<string, number>();
    periodEvents.filter(e => e.eventType === 'page_view').forEach(e => {
      sessionPageViews.set(e.sessionId, (sessionPageViews.get(e.sessionId) || 0) + 1);
    });
    const bouncedSessions = Array.from(sessionPageViews.values()).filter(count => count === 1).length;
    const bounceRate = uniqueSessions > 0 ? (bouncedSessions / uniqueSessions) * 100 : 0;
    metrics.push({
      id: (Date.now() + 2).toString(),
      userId,
      metricType: 'bounce_rate',
      value: bounceRate,
      period,
      periodStart,
      periodEnd,
      metadata: {},
      createdAt: new Date(),
    });

    // Conversion rate
    const conversions = periodEvents.filter(e => e.eventType === 'conversion').length;
    const conversionRate = uniqueSessions > 0 ? (conversions / uniqueSessions) * 100 : 0;
    metrics.push({
      id: (Date.now() + 3).toString(),
      userId,
      metricType: 'conversion_rate',
      value: conversionRate,
      period,
      periodStart,
      periodEnd,
      metadata: {},
      createdAt: new Date(),
    });

    // Average session duration
    const sessionDurations = new Map<string, number>();
    periodEvents.forEach(e => {
      const current = sessionDurations.get(e.sessionId) || 0;
      sessionDurations.set(e.sessionId, current + (e.properties.duration || 0));
    });
    const avgDuration = sessionDurations.size > 0
      ? Array.from(sessionDurations.values()).reduce((a, b) => a + b, 0) / sessionDurations.size
      : 0;
    metrics.push({
      id: (Date.now() + 4).toString(),
      userId,
      metricType: 'avg_session_duration',
      value: avgDuration,
      period,
      periodStart,
      periodEnd,
      metadata: {},
      createdAt: new Date(),
    });

    // Store metrics
    const userMetrics = this.metrics.get(userId) || [];
    metrics.forEach(m => userMetrics.push(m));
    this.metrics.set(userId, userMetrics);

    return metrics;
  }

  // Reports
  async generateReport(userId: string, reportData: {
    name: string;
    type: 'traffic' | 'conversion' | 'user_behavior' | 'performance' | 'custom';
    dateRange: { start: Date; end: Date };
    filters?: Record<string, any>;
  }): Promise<AnalyticsReport> {
    this.logger.log(`Generating report: ${reportData.name}`);
    
    const userEvents = this.events.get(userId) || [];
    const filteredEvents = userEvents.filter(e =>
      e.timestamp >= reportData.dateRange.start &&
      e.timestamp <= reportData.dateRange.end
    );

    // Generate data based on report type
    let data: any[] = [];
    let insights: string[] = [];
    let recommendations: string[] = [];

    switch (reportData.type) {
      case 'traffic':
        data = this.generateTrafficData(filteredEvents);
        insights = this.generateTrafficInsights(data);
        recommendations = ['Optimize high-traffic pages', 'Improve low-performing pages'];
        break;
      case 'conversion':
        data = this.generateConversionData(filteredEvents);
        insights = this.generateConversionInsights(data);
        recommendations = ['A/B test conversion flows', 'Simplify checkout process'];
        break;
      case 'user_behavior':
        data = this.generateBehaviorData(filteredEvents);
        insights = this.generateBehaviorInsights(data);
        recommendations = ['Improve navigation', 'Add more engaging content'];
        break;
      default:
        data = this.generateCustomData(filteredEvents);
        insights = ['Custom report generated'];
        recommendations = ['Review data and take action'];
    }

    const report: AnalyticsReport = {
      id: Date.now().toString(),
      userId,
      name: reportData.name,
      type: reportData.type,
      dateRange: reportData.dateRange,
      filters: reportData.filters || {},
      data,
      insights,
      recommendations,
      generatedAt: new Date(),
    };

    this.reports.set(report.id, report);

    return report;
  }

  async getReport(userId: string, reportId: string): Promise<AnalyticsReport> {
    const report = this.reports.get(reportId);
    
    if (!report || report.userId !== userId) {
      throw new Error('Report not found');
    }

    return report;
  }

  async getReports(userId: string): Promise<AnalyticsReport[]> {
    return Array.from(this.reports.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  // User Behavior Analysis
  private async updateUserBehavior(userId: string, event: AnalyticsEvent): Promise<void> {
    let behavior = this.behaviors.get(userId);
    
    if (!behavior) {
      behavior = {
        userId,
        sessionId: event.sessionId,
        pageViews: [],
        events: [],
        journey: [],
        totalDuration: 0,
        totalPages: 0,
        converted: false,
      };
    }

    if (event.eventType === 'page_view') {
      behavior.pageViews.push({
        page: event.properties.page,
        timestamp: event.timestamp,
        duration: event.properties.duration || 0,
        scrollDepth: event.properties.scrollDepth || 0,
      });
      behavior.totalPages++;
      behavior.totalDuration += event.properties.duration || 0;
      behavior.journey.push({
        step: behavior.journey.length + 1,
        page: event.properties.page,
        action: 'view',
        timestamp: event.timestamp,
      });
    } else if (event.eventType === 'click') {
      behavior.events.push({
        type: 'click',
        target: event.properties.target,
        timestamp: event.timestamp,
        properties: event.properties,
      });
    } else if (event.eventType === 'conversion') {
      behavior.converted = true;
      behavior.journey.push({
        step: behavior.journey.length + 1,
        page: event.properties.page || 'unknown',
        action: 'convert',
        timestamp: event.timestamp,
      });
    }

    this.behaviors.set(userId, behavior);
  }

  async getUserBehavior(userId: string): Promise<UserBehavior | null> {
    return this.behaviors.get(userId) || null;
  }

  // Real-time Analytics
  async getRealTimeStats(userId: string): Promise<any> {
    const userEvents = this.events.get(userId) || [];
    const last5Minutes = new Date(Date.now() - 5 * 60 * 1000);
    const recentEvents = userEvents.filter(e => e.timestamp >= last5Minutes);

    const activeUsers = new Set(recentEvents.map(e => e.sessionId)).size;
    const pageViews = recentEvents.filter(e => e.eventType === 'page_view').length;
    const conversions = recentEvents.filter(e => e.eventType === 'conversion').length;

    const topPages = new Map<string, number>();
    recentEvents.filter(e => e.eventType === 'page_view').forEach(e => {
      const page = e.properties.page;
      topPages.set(page, (topPages.get(page) || 0) + 1);
    });

    return {
      activeUsers,
      pageViews,
      conversions,
      conversionRate: activeUsers > 0 ? (conversions / activeUsers) * 100 : 0,
      topPages: Array.from(topPages.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([page, views]) => ({ page, views })),
      timestamp: new Date(),
    };
  }

  // Export functionality
  async exportAnalytics(userId: string, format: 'csv' | 'json' | 'pdf', reportId?: string): Promise<any> {
    this.logger.log(`Exporting analytics in ${format} format`);
    
    let data: any[];
    
    if (reportId) {
      const report = await this.getReport(userId, reportId);
      data = report.data;
    } else {
      const userEvents = this.events.get(userId) || [];
      data = userEvents;
    }

    // Mock export - in production, generate actual files
    return {
      format,
      userId,
      recordCount: data.length,
      url: `/exports/analytics-${Date.now()}.${format}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  // Helper methods
  private getPeriodStart(date: Date, period: string): Date {
    const d = new Date(date);
    switch (period) {
      case 'hour':
        d.setHours(d.getHours() - 1);
        break;
      case 'day':
        d.setDate(d.getDate() - 1);
        break;
      case 'week':
        d.setDate(d.getDate() - 7);
        break;
      case 'month':
        d.setMonth(d.getMonth() - 1);
        break;
      case 'year':
        d.setFullYear(d.getFullYear() - 1);
        break;
    }
    return d;
  }

  private generateTrafficData(events: AnalyticsEvent[]): any[] {
    const pageViews = new Map<string, number>();
    events.filter(e => e.eventType === 'page_view').forEach(e => {
      const page = e.properties.page;
      pageViews.set(page, (pageViews.get(page) || 0) + 1);
    });

    return Array.from(pageViews.entries()).map(([page, views]) => ({
      page,
      views,
      percentage: (views / events.length) * 100,
    }));
  }

  private generateTrafficInsights(data: any[]): string[] {
    const insights: string[] = [];
    const totalViews = data.reduce((sum, d) => sum + d.views, 0);
    
    if (data.length > 0) {
      const topPage = data[0];
      insights.push(`Top page: ${topPage.page} with ${topPage.views} views (${topPage.percentage.toFixed(1)}%)`);
    }

    if (totalViews > 1000) {
      insights.push('High traffic detected - consider scaling infrastructure');
    } else if (totalViews < 100) {
      insights.push('Low traffic - consider marketing campaigns');
    }

    return insights;
  }

  private generateConversionData(events: AnalyticsEvent[]): any[] {
    const conversions = events.filter(e => e.eventType === 'conversion');
    const byType = new Map<string, number>();
    
    conversions.forEach(e => {
      const type = e.eventName;
      byType.set(type, (byType.get(type) || 0) + 1);
    });

    return Array.from(byType.entries()).map(([type, count]) => ({
      type,
      count,
      value: count * 100, // Mock value
    }));
  }

  private generateConversionInsights(data: any[]): string[] {
    const insights: string[] = [];
    const totalConversions = data.reduce((sum, d) => sum + d.count, 0);
    
    insights.push(`Total conversions: ${totalConversions}`);
    
    if (data.length > 0) {
      const topConversion = data[0];
      insights.push(`Top conversion: ${topConversion.type} (${topConversion.count})`);
    }

    return insights;
  }

  private generateBehaviorData(events: AnalyticsEvent[]): any[] {
    const sessions = new Map<string, AnalyticsEvent[]>();
    events.forEach(e => {
      const sessionEvents = sessions.get(e.sessionId) || [];
      sessionEvents.push(e);
      sessions.set(e.sessionId, sessionEvents);
    });

    return Array.from(sessions.entries()).map(([sessionId, sessionEvents]) => ({
      sessionId,
      eventCount: sessionEvents.length,
      duration: sessionEvents.reduce((sum, e) => sum + (e.properties.duration || 0), 0),
      pages: new Set(sessionEvents.filter(e => e.eventType === 'page_view').map(e => e.properties.page)).size,
    }));
  }

  private generateBehaviorInsights(data: any[]): string[] {
    const insights: string[] = [];
    const avgDuration = data.reduce((sum, d) => sum + d.duration, 0) / data.length;
    const avgPages = data.reduce((sum, d) => sum + d.pages, 0) / data.length;

    insights.push(`Average session duration: ${avgDuration.toFixed(0)}s`);
    insights.push(`Average pages per session: ${avgPages.toFixed(1)}`);

    if (avgDuration < 30) {
      insights.push('Low engagement - consider improving content quality');
    }

    return insights;
  }

  private generateCustomData(events: AnalyticsEvent[]): any[] {
    return events.map(e => ({
      event: e.eventName,
      type: e.eventType,
      timestamp: e.timestamp,
      properties: e.properties,
    }));
  }

  // Dashboard data
  async getDashboardData(userId: string): Promise<any> {
    this.logger.log(`Getting dashboard data for user: ${userId}`);
    
    const userEvents = this.events.get(userId) || [];
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentEvents = userEvents.filter(e => e.timestamp >= last24Hours);

    const pageViews = recentEvents.filter(e => e.eventType === 'page_view').length;
    const uniqueVisitors = new Set(recentEvents.map(e => e.sessionId)).size;
    const conversions = recentEvents.filter(e => e.eventType === 'conversion').length;
    const bounceRate = uniqueVisitors > 0
      ? (recentEvents.filter(e => e.eventType === 'page_view').length / uniqueVisitors) * 100
      : 0;

    // Top pages
    const topPages = new Map<string, number>();
    recentEvents.filter(e => e.eventType === 'page_view').forEach(e => {
      const page = e.properties.page;
      topPages.set(page, (topPages.get(page) || 0) + 1);
    });

    // Traffic over time (hourly for last 24 hours)
    const trafficOverTime: any[] = [];
    for (let i = 23; i >= 0; i--) {
      const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
      const hourEvents = recentEvents.filter(e =>
        e.timestamp >= hourStart && e.timestamp < hourEnd
      );
      trafficOverTime.push({
        hour: hourStart.getHours(),
        views: hourEvents.filter(e => e.eventType === 'page_view').length,
        visitors: new Set(hourEvents.map(e => e.sessionId)).size,
      });
    }

    return {
      summary: {
        pageViews,
        uniqueVisitors,
        conversions,
        bounceRate: bounceRate.toFixed(1),
        conversionRate: uniqueVisitors > 0 ? ((conversions / uniqueVisitors) * 100).toFixed(1) : '0',
      },
      topPages: Array.from(topPages.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([page, views]) => ({ page, views })),
      trafficOverTime,
      recentEvents: recentEvents.slice(-50),
    };
  }
}