import { analytics } from './analytics-engine';
import { MetricType } from './types';

const sampleMetrics: MetricType[] = ['brand_health', 'engagement', 'conversion', 'traffic', 'sentiment', 'reach', 'growth'];

async function seedAnalytics() {
  console.log('Seeding analytics data...');

  const report = await analytics.generateReport({
    name: 'Monthly Brand Performance',
    metrics: sampleMetrics,
    dateRange: '30d',
  });

  console.log(`Generated report: ${report.id}`);
  console.log(`Metrics: ${report.metrics.length}`);
  console.log(`Charts: ${report.charts.length}`);
  console.log(`Insights: ${report.insights.length}`);

  const brandHealth = analytics.calculateBrandHealth({
    mentions: 15000,
    sentiment: 78,
    engagement: 45000,
    loyalty: 72,
  });
  console.log(`Brand health score: ${brandHealth.overall}`);

  const engagement = analytics.analyzeEngagement([
    { type: 'page_view', count: 120000, channel: 'web' },
    { type: 'like', count: 8500, channel: 'social' },
    { type: 'click', count: 32000, channel: 'email' },
  ]);
  console.log(`Total interactions: ${engagement.totalInteractions}`);

  console.log('Analytics seed complete.');
}

seedAnalytics().catch(console.error);
