import { useState, useEffect } from 'react';
import {
  EyeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { getDashboardOverview } from '../../api/dashboard.api';
import { DashboardOverviewResponse } from '../../types/dashboard.types';
import PortfolioHealthCard from '../health/PortfolioHealthCard';
import RecentProjects from './RecentProjects';
import AnalyticsCard from '../analytics/AnalyticsCard';
import AnalyticsTrendsSection from '../analytics/AnalyticsTrendsSection';
import Loader from '../Loader';

const DashboardOverview = () => {
  const [overview, setOverview] = useState<DashboardOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardOverview();
      setOverview(data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to load dashboard overview');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !overview) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
        {error || 'Failed to load dashboard overview'}
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Health Section */}
      <PortfolioHealthCard health={overview.portfolioHealth} />

      {/* Quick Insights - Analytics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnalyticsCard
            label="Total Views"
            value={formatNumber(overview.analytics.totalViews)}
            description="Total portfolio page views"
            icon={<EyeIcon className="w-6 h-6" />}
            bgColor="bg-blue-50 border-blue-100"
            iconBg="bg-blue-100"
          />
          <AnalyticsCard
            label="Engagement Rate"
            value={`${overview.analytics.engagementRate}%`}
            description="Percentage of engaged visitors"
            icon={<CheckCircleIcon className="w-6 h-6" />}
            bgColor="bg-green-50 border-green-100"
            iconBg="bg-green-100"
          />
          <AnalyticsCard
            label="Bounce Rate"
            value={`${overview.analytics.bounceRate}%`}
            description="Percentage of single-page visits"
            icon={<ArrowRightIcon className="w-6 h-6" />}
            bgColor="bg-orange-50 border-orange-100"
            iconBg="bg-orange-100"
          />
        </div>
      </div>

      {/* Analytics Trends Section */}
      <AnalyticsTrendsSection />

      {/* Recent Projects */}
      <RecentProjects projects={overview.projects.recent} total={overview.projects.total} />
    </div>
  );
};

export default DashboardOverview;

