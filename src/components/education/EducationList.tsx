import { useState, useEffect } from 'react';
import { getEducation, createEducation, updateEducation, deleteEducation } from '../../api/education.api';
import { EducationResponse, EducationRequest } from '../../types/education.types';
import EducationCard from './EducationCard';
import EducationForm from './EducationForm';
import ConfirmDialog from '../ConfirmDialog';
import Loader from '../Loader';

const EducationList = () => {
  const [educations, setEducations] = useState<EducationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationResponse | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    educationId: string | null;
    institutionName: string;
  }>({
    isOpen: false,
    educationId: null,
    institutionName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEducation();
      setEducations(data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to load education');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingEducation(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    const education = educations.find((e) => e.id === id);
    setEditingEducation(education);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: EducationRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingEducation) {
        await updateEducation(editingEducation.id, data);
      } else {
        await createEducation(data);
      }
      setIsFormOpen(false);
      setEditingEducation(undefined);
      await loadEducations();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to save education');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingEducation(undefined);
    setError(null);
  };

  const handleDeleteClick = (id: string) => {
    const education = educations.find((e) => e.id === id);
    setDeleteDialog({
      isOpen: true,
      educationId: id,
      institutionName: education?.institution || 'this education',
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.educationId) return;

    setIsDeleting(true);
    try {
      await deleteEducation(deleteDialog.educationId);
      setEducations(educations.filter((e) => e.id !== deleteDialog.educationId));
      setDeleteDialog({ isOpen: false, educationId: null, institutionName: '' });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to delete education');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, educationId: null, institutionName: '' });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Education</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add your educational background and qualifications
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Education
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">
            {editingEducation ? 'Edit Education' : 'Add New Education'}
          </h3>
          <EducationForm
            education={editingEducation}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {educations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No education entries yet</h3>
          <p className="text-sm text-gray-600 mb-6">
            Get started by adding your educational background.
          </p>
          <button
            onClick={handleAddClick}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add your first education
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {educations.map((education) => (
            <EducationCard
              key={education.id}
              education={education}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Education"
        message={`Are you sure you want to delete education from "${deleteDialog.institutionName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </div>
  );
};

export default EducationList;

