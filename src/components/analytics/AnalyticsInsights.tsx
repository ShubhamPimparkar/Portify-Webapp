import { TrendDataPoint } from '../../types/analyticsTrends.types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface AnalyticsInsightsProps {
  views: TrendDataPoint[];
  engagementRate: TrendDataPoint[];
  bounceRate: TrendDataPoint[];
}

const AnalyticsInsights = ({ views, engagementRate, bounceRate }: AnalyticsInsightsProps) => {
  const getTimePeriod = (data: TrendDataPoint[]): string => {
    if (!data || data.length < 2) return '';
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstDate = new Date(sorted[0].date);
    const lastDate = new Date(sorted[sorted.length - 1].date);
    const diffDays = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return 'this week';
    if (diffDays <= 30) return 'this month';
    return 'over time';
  };

  const calculateChange = (data: TrendDataPoint[], field: 'count' | 'value'): number | null => {
    if (!data || data.length < 2) return null;

    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const firstValue = field === 'count' ? first.count : first.value;
    const lastValue = field === 'count' ? last.count : last.value;

    if (firstValue === undefined || lastValue === undefined || firstValue === 0) return null;

    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const viewsChange = calculateChange(views, 'count');
  const engagementChange = calculateChange(engagementRate, 'value');
  const bounceChange = calculateChange(bounceRate, 'value');

  const insights = [];

  if (viewsChange !== null) {
    const isPositive = viewsChange > 0;
    insights.push({
      text: `Views ${isPositive ? 'increased' : 'decreased'} by ${Math.abs(viewsChange).toFixed(0)}% ${getTimePeriod(views)}`,
      isPositive,
      icon: isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
    });
  }

  if (engagementChange !== null) {
    const isPositive = engagementChange > 0;
    insights.push({
      text: `Engagement ${isPositive ? 'improved' : 'declined'} by ${Math.abs(engagementChange).toFixed(0)}% ${getTimePeriod(engagementRate)}`,
      isPositive,
      icon: isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
    });
  }

  if (bounceChange !== null) {
    // For bounce rate, lower is better, so we invert the logic
    const isPositive = bounceChange < 0;
    insights.push({
      text: `Bounce rate ${isPositive ? 'decreasing' : 'increasing'} by ${Math.abs(bounceChange).toFixed(0)}% ${getTimePeriod(bounceRate)}`,
      isPositive,
      icon: isPositive ? ArrowTrendingDownIcon : ArrowTrendingUpIcon,
    });
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              insight.isPositive
                ? 'bg-green-50 border-green-100'
                : 'bg-orange-50 border-orange-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <Icon
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  insight.isPositive ? 'text-green-600' : 'text-orange-600'
                }`}
              />
              <p className={`text-sm ${
                insight.isPositive ? 'text-green-800' : 'text-orange-800'
              }`}>
                {insight.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsInsights;

