import { useState, useEffect } from 'react';
import {
  EyeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { getDashboardAnalytics } from '../../api/analytics.api';
import { DashboardAnalyticsResponse } from '../../types/analytics.types';
import AnalyticsCard from './AnalyticsCard';

const AnalyticsOverview = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardAnalytics();
      setAnalytics(data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to load analytics');
      } else {
        setError('An unexpected error occurred');
      }
      // Set default values on error
      setAnalytics({
        totalViews: 0,
        engagementRate: 0,
        bounceRate: 0,
        avgTimeOnPage: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const metrics = analytics
    ? [
        {
          label: 'Total Views',
          value: formatNumber(analytics.totalViews),
          description: 'Total portfolio page views',
          icon: <EyeIcon className="w-6 h-6" />,
          bgColor: 'bg-blue-50 border-blue-100',
          iconBg: 'bg-blue-100',
        },
        {
          label: 'Engagement Rate',
          value: `${analytics.engagementRate}%`,
          description: 'Percentage of engaged visitors',
          icon: <CheckCircleIcon className="w-6 h-6" />,
          bgColor: 'bg-green-50 border-green-100',
          iconBg: 'bg-green-100',
        },
        {
          label: 'Bounce Rate',
          value: `${analytics.bounceRate}%`,
          description: 'Percentage of single-page visits',
          icon: <ArrowRightIcon className="w-6 h-6" />,
          bgColor: 'bg-orange-50 border-orange-100',
          iconBg: 'bg-orange-100',
        },
        {
          label: 'Avg Time on Page',
          value: formatTime(analytics.avgTimeOnPage),
          description: 'Average visit duration',
          icon: <ClockIcon className="w-6 h-6" />,
          bgColor: 'bg-purple-50 border-purple-100',
          iconBg: 'bg-purple-100',
        },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <AnalyticsCard
            key={index}
            label={metric.label}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            bgColor={metric.bgColor}
            iconBg={metric.iconBg}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsOverview;

