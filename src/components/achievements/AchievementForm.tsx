import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AchievementRequest, AchievementResponse } from '../../types/achievement.types';

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  description: z.string().optional(),
  link: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
});

type AchievementFormData = z.infer<typeof achievementSchema>;

interface AchievementFormProps {
  achievement?: AchievementResponse;
  onSubmit: (data: AchievementRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const AchievementForm = ({
  achievement,
  onSubmit,
  onCancel,
  isSubmitting,
}: AchievementFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: achievement
      ? {
          title: achievement.title,
          issuer: achievement.issuer || '',
          issueDate: achievement.issueDate ? achievement.issueDate.split('T')[0] : '',
          description: achievement.description || '',
          link: achievement.link || '',
        }
      : {
          title: '',
          issuer: '',
          issueDate: '',
          description: '',
          link: '',
        },
  });

  const handleFormSubmit = async (data: AchievementFormData) => {
    const achievementData: AchievementRequest = {
      title: data.title,
      issuer: data.issuer || undefined,
      issueDate: data.issueDate || undefined,
      description: data.description || undefined,
      link: data.link || undefined,
    };
    await onSubmit(achievementData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Certification Name, Award Title, etc."
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-1.5">
          Issuer
        </label>
        <input
          id="issuer"
          type="text"
          {...register('issuer')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.issuer ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Organization, Company, Institution, etc."
        />
        {errors.issuer && <p className="mt-1 text-sm text-red-600">{errors.issuer.message}</p>}
      </div>

      <div>
        <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1.5">
          Issue Date
        </label>
        <input
          id="issueDate"
          type="date"
          {...register('issueDate')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.issueDate ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.issueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Describe the achievement, its significance, or what it represents..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1.5">
          Link
        </label>
        <input
          id="link"
          type="url"
          {...register('link')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.link ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="https://example.com/certificate"
        />
        <p className="mt-1 text-xs text-gray-500">Optional link to certificate or verification</p>
        {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : achievement ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default AchievementForm;

