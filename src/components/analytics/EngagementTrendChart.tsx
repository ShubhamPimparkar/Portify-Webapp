import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendDataPoint } from '../../types/analyticsTrends.types';

interface EngagementTrendChartProps {
  engagementData: TrendDataPoint[];
  bounceData: TrendDataPoint[];
  isLoading?: boolean;
}

const EngagementTrendChart = ({
  engagementData,
  bounceData,
  isLoading = false,
}: EngagementTrendChartProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading chart...</span>
      </div>
    );
  }

  if (
    (!engagementData || engagementData.length === 0) &&
    (!bounceData || bounceData.length === 0)
  ) {
    return (
      <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">No data yet</p>
          <p className="text-gray-400 text-xs">Start tracking to see trends</p>
        </div>
      </div>
    );
  }

  // Merge data by date
  const dateMap = new Map<string, { engagement?: number; bounce?: number }>();

  engagementData.forEach((point) => {
    const date = new Date(point.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    if (!dateMap.has(date)) {
      dateMap.set(date, {});
    }
    dateMap.get(date)!.engagement = point.value || 0;
  });

  bounceData.forEach((point) => {
    const date = new Date(point.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    if (!dateMap.has(date)) {
      dateMap.set(date, {});
    }
    dateMap.get(date)!.bounce = point.value || 0;
  });

  const chartData = Array.from(dateMap.entries()).map(([date, values]) => ({
    date,
    engagement: values.engagement ?? null,
    bounce: values.bounce ?? null,
  }));

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; dataKey: string; color?: string; payload?: { date: string } }>;
  }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span>{' '}
              {entry.value !== null ? `${entry.value}%` : 'N/A'}
            </p>
          ))}
          {payload[0]?.payload?.date && (
            <p className="text-xs text-gray-500 mt-1">{payload[0].payload.date}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement vs Bounce Rate</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value) => (
              <span className="text-sm text-gray-700">{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="engagement"
            name="Engagement Rate"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="bounce"
            name="Bounce Rate"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: '#f97316', r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementTrendChart;

