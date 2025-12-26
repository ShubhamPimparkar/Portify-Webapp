export interface HealthCheck {
  label: string;
  done: boolean;
  points?: number;
}

export interface PortfolioHealthResponse {
  score: number; // 0-100
  checks: HealthCheck[];
}

export interface DashboardOverviewResponse {
  user: {
    name: string;
    email: string;
  };
  portfolioHealth: PortfolioHealthResponse;
  analytics: {
    totalViews: number;
    engagementRate: number;
    bounceRate: number;
  };
  projects: {
    total: number;
    recent: {
      id: string;
      title: string;
      createdAt: string;
    }[];
  };
}

