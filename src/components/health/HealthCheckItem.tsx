import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HealthCheck } from '../../types/dashboard.types';

interface HealthCheckItemProps {
  check: HealthCheck;
}

const HealthCheckItem = ({ check }: HealthCheckItemProps) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
        check.done ? 'bg-green-100' : 'bg-gray-100'
      }`}>
        {check.done ? (
          <CheckIcon className="w-4 h-4 text-green-600" />
        ) : (
          <XMarkIcon className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <span className={`text-sm ${check.done ? 'text-gray-700' : 'text-gray-500'}`}>
        {check.label}
      </span>
    </div>
  );
};

export default HealthCheckItem;

