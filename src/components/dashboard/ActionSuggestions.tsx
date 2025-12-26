import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { HealthCheck } from '../../types/dashboard.types';

interface ActionSuggestionsProps {
  checks: HealthCheck[];
}

const ActionSuggestions = ({ checks }: ActionSuggestionsProps) => {
  const navigate = useNavigate();

  const incompleteChecks = checks.filter((check) => !check.done);

  if (incompleteChecks.length === 0) {
    return null;
  }

  const getActionRoute = (label: string): string | null => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('profile')) return '/profile';
    if (lowerLabel.includes('education')) return '/profile';
    if (lowerLabel.includes('project')) return '/projects/new';
    if (lowerLabel.includes('achievement')) return '/profile';
    return null;
  };

  const getActionText = (label: string): string => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('profile')) return 'Complete Profile';
    if (lowerLabel.includes('education')) return 'Add Education';
    if (lowerLabel.includes('project')) return 'Add Project';
    if (lowerLabel.includes('achievement')) return 'Add Achievement';
    return 'Take Action';
  };

  return (
    <div className="card p-6 bg-yellow-50 border-yellow-100">
      <div className="flex items-start gap-3 mb-4">
        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Action Suggestions</h2>
          <p className="text-sm text-gray-600">
            Complete these items to improve your portfolio health score
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {incompleteChecks.slice(0, 3).map((check, index) => {
          const route = getActionRoute(check.label);
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200"
            >
              <span className="text-sm text-gray-700">{check.label}</span>
              {route && (
                <button
                  onClick={() => navigate(route)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
                >
                  {getActionText(check.label)}
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionSuggestions;

