import { useState, useEffect } from 'react';
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../../api/achievements.api';
import { AchievementResponse, AchievementRequest } from '../../types/achievement.types';
import AchievementCard from './AchievementCard';
import AchievementForm from './AchievementForm';
import ConfirmDialog from '../ConfirmDialog';
import Loader from '../Loader';

const AchievementList = () => {
  const [achievements, setAchievements] = useState<AchievementResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementResponse | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    achievementId: string | null;
    achievementTitle: string;
  }>({
    isOpen: false,
    achievementId: null,
    achievementTitle: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAchievements();
      setAchievements(data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to load achievements');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingAchievement(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    const achievement = achievements.find((a) => a.id === id);
    setEditingAchievement(achievement);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: AchievementRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingAchievement) {
        await updateAchievement(editingAchievement.id, data);
      } else {
        await createAchievement(data);
      }
      setIsFormOpen(false);
      setEditingAchievement(undefined);
      await loadAchievements();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to save achievement');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingAchievement(undefined);
    setError(null);
  };

  const handleDeleteClick = (id: string) => {
    const achievement = achievements.find((a) => a.id === id);
    setDeleteDialog({
      isOpen: true,
      achievementId: id,
      achievementTitle: achievement?.title || 'this achievement',
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.achievementId) return;

    setIsDeleting(true);
    try {
      await deleteAchievement(deleteDialog.achievementId);
      setAchievements(achievements.filter((a) => a.id !== deleteDialog.achievementId));
      setDeleteDialog({ isOpen: false, achievementId: null, achievementTitle: '' });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to delete achievement');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, achievementId: null, achievementTitle: '' });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Achievements</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add certifications, awards, and other accomplishments
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Achievement
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
            {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
          </h3>
          <AchievementForm
            achievement={editingAchievement}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {achievements.length === 0 ? (
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
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
          <p className="text-sm text-gray-600 mb-6">
            Get started by adding your first achievement or certification.
          </p>
          <button
            onClick={handleAddClick}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add your first achievement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Achievement"
        message={`Are you sure you want to delete "${deleteDialog.achievementTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </div>
  );
};

export default AchievementList;

