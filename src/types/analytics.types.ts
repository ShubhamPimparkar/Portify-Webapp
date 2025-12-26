export interface DashboardAnalyticsResponse {
  totalViews: number;
  engagementRate: number; // Percentage (0-100)
  bounceRate: number; // Percentage (0-100)
  avgTimeOnPage: number; // Average duration in seconds
}

