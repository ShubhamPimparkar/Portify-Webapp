import { PortfolioHealthResponse } from '../../types/dashboard.types';
import HealthProgress from './HealthProgress';
import HealthCheckItem from './HealthCheckItem';

interface PortfolioHealthCardProps {
  health: PortfolioHealthResponse;
}

const PortfolioHealthCard = ({ health }: PortfolioHealthCardProps) => {
  const getHealthMessage = (score: number): string => {
    if (score >= 80) {
      return 'Your portfolio is in excellent shape!';
    } else if (score >= 60) {
      return 'Your portfolio is in good shape. Improve it further.';
    } else {
      return 'Your portfolio needs attention. Complete the items below.';
    }
  };

  const getBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-50 border-green-100';
    if (score >= 60) return 'bg-yellow-50 border-yellow-100';
    return 'bg-red-50 border-red-100';
  };

  return (
    <div className={`card p-6 ${getBgColor(health.score)}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-shrink-0">
          <HealthProgress score={health.score} size={120} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Portfolio Health</h3>
          <p className="text-sm text-gray-600 mb-4">{getHealthMessage(health.score)}</p>
          <div className="space-y-1">
            {health.checks.map((check, index) => (
              <HealthCheckItem key={index} check={check} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHealthCard;

