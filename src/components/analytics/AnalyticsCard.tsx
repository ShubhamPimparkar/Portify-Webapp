import { ReactNode } from 'react';

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  bgColor: string;
  iconBg: string;
  isLoading?: boolean;
}

const AnalyticsCard = ({
  label,
  value,
  description,
  icon,
  bgColor,
  iconBg,
  isLoading = false,
}: AnalyticsCardProps) => {
  const displayValue = isLoading ? '—' : value;

  return (
    <div className={`card p-6 ${bgColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg bg-white/60 ${iconBg}`}>{icon}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{displayValue}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default AnalyticsCard;

