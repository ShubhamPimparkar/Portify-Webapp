interface HealthProgressProps {
  score: number; // 0-100
  size?: number;
}

const HealthProgress = ({ score, size = 120 }: HealthProgressProps) => {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrokeColor = (score: number): string => {
    if (score >= 80) return 'stroke-green-600';
    if (score >= 60) return 'stroke-yellow-600';
    return 'stroke-red-600';
  };

  const getBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-50 border-green-100';
    if (score >= 60) return 'bg-yellow-50 border-yellow-100';
    return 'bg-red-50 border-red-100';
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${getBgColor(score)} rounded-full`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${getStrokeColor(score)} transition-all duration-500`}
        />
      </svg>
      <div className="text-center z-10">
        <div className={`text-3xl font-bold ${getColor(score)}`}>{score}</div>
        <div className="text-xs text-gray-500 mt-0.5">/ 100</div>
      </div>
    </div>
  );
};

export default HealthProgress;
