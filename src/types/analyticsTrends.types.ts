export interface TrendDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  count?: number; // For views
  value?: number; // For rates (0-100)
}

export interface AnalyticsTrendsResponse {
  views: TrendDataPoint[];
  engagementRate: TrendDataPoint[];
  bounceRate: TrendDataPoint[];
}

