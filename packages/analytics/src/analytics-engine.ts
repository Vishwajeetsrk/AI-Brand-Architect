import { Metric, AnalyticsReport, ChartData, BrandHealthScore, EngagementMetrics, MetricType } from './types';

export class AnalyticsEngine {
  async generateReport(options: { name: string; metrics: MetricType[]; dateRange: string }): Promise<AnalyticsReport> {
    const metrics = await Promise.all(options.metrics.map(m => this.calculateMetric(m)));
    return {
      id: crypto.randomUUID(),
      name: options.name,
      dateRange: options.dateRange as any,
      metrics,
      charts: this.generateCharts(metrics),
      insights: this.generateInsights(metrics),
      generatedAt: new Date().toISOString(),
    };
  }

  private async calculateMetric(type: MetricType): Promise<Metric> {
    const baseValue = this.getBaseValue(type);
    const variance = baseValue * (Math.random() * 0.2 - 0.1);
    return {
      id: crypto.randomUUID(),
      name: this.getMetricName(type),
      type,
      value: Math.round(baseValue + variance),
      previousValue: Math.round(baseValue * 0.9),
      change: Math.round(variance),
      changePercentage: Math.round((variance / baseValue) * 100),
      trend: variance > 0 ? 'up' : variance < 0 ? 'down' : 'stable',
      unit: this.getMetricUnit(type),
      period: '30d',
    };
  }

  private getBaseValue(type: MetricType): number {
    const values: Record<MetricType, number> = {
      brand_health: 78, engagement: 45000, conversion: 12.5,
      traffic: 250000, sentiment: 72, reach: 180000, growth: 15,
    };
    return values[type] || 100;
  }

  private getMetricName(type: MetricType): string {
    const names: Record<MetricType, string> = {
      brand_health: 'Brand Health Score', engagement: 'Total Engagements',
      conversion: 'Conversion Rate', traffic: 'Website Traffic',
      sentiment: 'Brand Sentiment', reach: 'Social Reach', growth: 'Growth Rate',
    };
    return names[type];
  }

  private getMetricUnit(type: MetricType): string {
    const units: Record<MetricType, string> = {
      brand_health: '%', engagement: '', conversion: '%',
      traffic: '', sentiment: '%', reach: '', growth: '%',
    };
    return units[type];
  }

  private generateCharts(metrics: Metric[]): ChartData[] {
    return metrics.map(m => ({
      id: crypto.randomUUID(),
      title: `${m.name} Trend`,
      type: 'line' as const,
      labels: Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [{
        label: m.name,
        data: Array.from({ length: 7 }, () => Math.round(m.value * (0.85 + Math.random() * 0.3))),
        color: '#7c3aed',
      }],
    }));
  }

  private generateInsights(metrics: Metric[]): string[] {
    const insights: string[] = [];
    for (const m of metrics) {
      if (m.trend === 'up') insights.push(`${m.name} increased by ${Math.abs(m.changePercentage)}% compared to last period.`);
      else if (m.trend === 'down') insights.push(`${m.name} decreased by ${Math.abs(m.changePercentage)}%. Review your strategy.`);
    }
    insights.push('Brand awareness campaigns driving positive sentiment growth.');
    insights.push('Consider increasing social media activity to boost engagement rates.');
    return insights;
  }

  calculateBrandHealth(brandData: { mentions: number; sentiment: number; engagement: number; loyalty: number }): BrandHealthScore {
    return {
      overall: Math.round((brandData.mentions * 0.2 + brandData.sentiment * 0.3 + brandData.engagement * 0.25 + brandData.loyalty * 0.25)),
      awareness: Math.min(100, Math.round(brandData.mentions * 0.5)),
      perception: brandData.sentiment,
      loyalty: brandData.loyalty,
      advocacy: Math.round(brandData.loyalty * 0.8),
      trends: Array.from({ length: 12 }, (_, i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (11 - i));
        return { date: d.toISOString().slice(0, 7), score: Math.round(60 + Math.random() * 35) };
      }),
    };
  }

  analyzeEngagement(activities: { type: string; count: number; channel: string }[]): EngagementMetrics {
    return {
      totalInteractions: activities.reduce((s, a) => s + a.count, 0),
      averageEngagementRate: 4.7,
      topContent: [
        { title: 'Brand Identity Guide', engagement: 12340, type: 'guide' },
        { title: 'Color Palette Generator', engagement: 8920, type: 'tool' },
        { title: 'Industry Trends Report', engagement: 6740, type: 'report' },
      ],
      engagementByChannel: { email: 35, social: 28, web: 22, ads: 15 },
      dailyEngagement: Array.from({ length: 30 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (29 - i));
        return { date: d.toISOString().slice(0, 10), count: Math.round(1000 + Math.random() * 3000) };
      }),
    };
  }
}

export const analytics = new AnalyticsEngine();
