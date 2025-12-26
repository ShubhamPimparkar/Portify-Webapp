import { EducationResponse } from '../../types/education.types';

interface EducationCardProps {
  education: EducationResponse;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EducationCard = ({ education, onEdit, onDelete }: EducationCardProps) => {
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (): string => {
    const start = formatDate(education.startDate);
    const end = formatDate(education.endDate);
    return `${start} - ${end}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{education.institution}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="font-medium">{education.degree}</span>
            {education.fieldOfStudy && (
              <>
                <span className="text-gray-400">•</span>
                <span>{education.fieldOfStudy}</span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500">{formatDateRange()}</p>
        </div>
      </div>

      {education.grade && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200">
            Grade: {education.grade}
          </span>
        </div>
      )}

      {education.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{education.description}</p>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <div className="flex-1" />
        <button
          onClick={() => onEdit(education.id)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(education.id)}
          className="px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EducationCard;

