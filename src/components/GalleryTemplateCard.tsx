interface GalleryTemplateCardProps {
  name: string;
  description: string;
  templateKey: string;
  isSelected: boolean;
  isSaved: boolean;
  onClick: () => void;
}

const GalleryTemplateCard = ({ name, description, templateKey, isSelected, isSaved, onClick }: GalleryTemplateCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-6 rounded-lg border-2 transition-colors relative ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {isSaved && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
            Saved
          </span>
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        {isSelected && !isSaved && (
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
};

export default GalleryTemplateCard;
