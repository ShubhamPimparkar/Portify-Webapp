import { AchievementResponse } from '../../types/achievement.types';

interface AchievementCardProps {
  achievement: AchievementResponse;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AchievementCard = ({ achievement, onEdit, onDelete }: AchievementCardProps) => {
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{achievement.title}</h3>
          {achievement.issuer && (
            <p className="text-sm text-gray-600 mb-2">Issued by: {achievement.issuer}</p>
          )}
          {achievement.issueDate && (
            <p className="text-sm text-gray-500">{formatDate(achievement.issueDate)}</p>
          )}
        </div>
      </div>

      {achievement.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{achievement.description}</p>
      )}

      {achievement.link && (
        <div className="mb-4">
          <a
            href={achievement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
          >
            View Link
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <div className="flex-1" />
        <button
          onClick={() => onEdit(achievement.id)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(achievement.id)}
          className="px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AchievementCard;

