import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EducationRequest, EducationResponse } from '../../types/education.types';

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationFormProps {
  education?: EducationResponse;
  onSubmit: (data: EducationRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const EducationForm = ({ education, onSubmit, onCancel, isSubmitting }: EducationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: education
      ? {
          institution: education.institution,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy || '',
          startDate: education.startDate ? education.startDate.split('T')[0] : '',
          endDate: education.endDate ? education.endDate.split('T')[0] : '',
          grade: education.grade || '',
          description: education.description || '',
        }
      : {
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          grade: '',
          description: '',
        },
  });

  const handleFormSubmit = async (data: EducationFormData) => {
    const educationData: EducationRequest = {
      institution: data.institution,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy || undefined,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      grade: data.grade || undefined,
      description: data.description || undefined,
    };
    await onSubmit(educationData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1.5">
          Institution <span className="text-red-500">*</span>
        </label>
        <input
          id="institution"
          type="text"
          {...register('institution')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.institution ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="University Name"
        />
        {errors.institution && (
          <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1.5">
          Degree <span className="text-red-500">*</span>
        </label>
        <input
          id="degree"
          type="text"
          {...register('degree')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.degree ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Bachelor of Science, Master of Arts, etc."
        />
        {errors.degree && (
          <p className="mt-1 text-sm text-red-600">{errors.degree.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1.5">
          Field of Study
        </label>
        <input
          id="fieldOfStudy"
          type="text"
          {...register('fieldOfStudy')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.fieldOfStudy ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Computer Science, Business Administration, etc."
        />
        {errors.fieldOfStudy && (
          <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1.5">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            id="startDate"
            type="date"
            {...register('startDate')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.startDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1.5">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            {...register('endDate')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.endDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <p className="mt-1 text-xs text-gray-500">Leave empty if ongoing</p>
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1.5">
          Grade / GPA
        </label>
        <input
          id="grade"
          type="text"
          {...register('grade')}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.grade ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="3.8 GPA, First Class, etc."
        />
        {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>}
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
          placeholder="Additional details about your education..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
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
          {isSubmitting ? 'Saving...' : education ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default EducationForm;

