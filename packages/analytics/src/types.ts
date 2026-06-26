export type MetricType = 'brand_health' | 'engagement' | 'conversion' | 'traffic' | 'sentiment' | 'reach' | 'growth';
export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'custom';
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'donut' | 'heatmap';

export interface Metric {
  id: string;
  name: string;
  type: MetricType;
  value: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  period: string;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  dateRange: TimeRange;
  metrics: Metric[];
  charts: ChartData[];
  insights: string[];
  generatedAt: string;
}

export interface ChartData {
  id: string;
  title: string;
  type: ChartType;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

export interface BrandHealthScore {
  overall: number;
  awareness: number;
  perception: number;
  loyalty: number;
  advocacy: number;
  trends: { date: string; score: number }[];
}

export interface EngagementMetrics {
  totalInteractions: number;
  averageEngagementRate: number;
  topContent: { title: string; engagement: number; type: string }[];
  engagementByChannel: Record<string, number>;
  dailyEngagement: { date: string; count: number }[];
}
