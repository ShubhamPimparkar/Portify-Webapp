import { useState, useEffect } from 'react';
import { getAnalyticsTrends } from '../../api/analyticsTrends.api';
import { AnalyticsTrendsResponse } from '../../types/analyticsTrends.types';
import ViewsTrendChart from './ViewsTrendChart';
import EngagementTrendChart from './EngagementTrendChart';
import AnalyticsInsights from './AnalyticsInsights';
import Loader from '../Loader';

const AnalyticsTrendsSection = () => {
  const [trends, setTrends] = useState<AnalyticsTrendsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAnalyticsTrends();
      setTrends(data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to load analytics trends');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!trends) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics Trends</h2>
      </div>

      {/* Views Trend Chart */}
      <div className="card p-6">
        <ViewsTrendChart data={trends.views} isLoading={isLoading} />
      </div>

      {/* Engagement vs Bounce Trend Chart */}
      <div className="card p-6">
        <EngagementTrendChart
          engagementData={trends.engagementRate}
          bounceData={trends.bounceRate}
          isLoading={isLoading}
        />
      </div>

      {/* Insights Summary */}
      <AnalyticsInsights
        views={trends.views}
        engagementRate={trends.engagementRate}
        bounceRate={trends.bounceRate}
      />
    </div>
  );
};

export default AnalyticsTrendsSection;

