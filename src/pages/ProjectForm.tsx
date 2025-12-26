import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createProject, updateProject, getProjects } from '../api/projects.api';
import { ProjectRequest } from '../types/project.types';
import SkillInput from '../components/SkillInput';
import Loader from '../components/Loader';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  projectUrl: z.string().url('Invalid project URL').or(z.literal('')),
  githubRepoUrl: z.string().url('Invalid GitHub URL').or(z.literal('')),
  role: z.string(),
  isPublic: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      techStack: [],
      projectUrl: '',
      githubRepoUrl: '',
      role: '',
      isPublic: true,
    },
  });

  const techStack = watch('techStack');
  const isPublic = watch('isPublic');

  // Load project data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadProject = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const projects = await getProjects();
          const project = projects.find((p) => p.id === id);
          if (project) {
            setValue('title', project.title);
            setValue('description', project.description);
            setValue('techStack', project.techStack);
            setValue('projectUrl', project.projectUrl);
            setValue('githubRepoUrl', project.githubRepoUrl);
            setValue('role', project.role);
            setValue('isPublic', project.isPublic);
          } else {
            setError('Project not found');
          }
        } catch (err: unknown) {
          if (err && typeof err === 'object' && 'response' in err) {
            const axiosError = err as { response?: { data?: { message?: string } } };
            setError(axiosError.response?.data?.message || 'Failed to load project');
          } else {
            setError('An unexpected error occurred');
          }
        } finally {
          setIsLoading(false);
        }
      };

      loadProject();
    }
  }, [id, isEditMode, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsSaving(true);
    setError(null);

    try {
      const projectData: ProjectRequest = {
        title: data.title,
        description: data.description,
        techStack: data.techStack,
        projectUrl: data.projectUrl || '',
        githubRepoUrl: data.githubRepoUrl || '',
        role: data.role || '',
        isPublic: data.isPublic,
      };

      if (isEditMode && id) {
        await updateProject(id, projectData);
      } else {
        await createProject(projectData);
      }

      navigate('/projects');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to save project');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {isEditMode ? 'Edit Project' : 'Add New Project'}
          </h1>
          <p className="text-sm text-gray-600">
            {isEditMode
              ? 'Update your project information'
              : 'Add a new project to showcase your work'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Project Details */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Project Details</h2>
              <div className="space-y-4">
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
                    placeholder="My Awesome Project"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    {...register('role')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.role ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Full Stack Developer, Lead Developer, etc."
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    {...register('description')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your project, what it does, key features, and technologies used..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Tech Stack */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tech Stack</h2>
              <SkillInput
                skills={techStack}
                onChange={(newTechStack) => setValue('techStack', newTechStack)}
                error={errors.techStack?.message}
              />
            </section>

            {/* Links */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Links</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="githubRepoUrl"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    GitHub Repository URL
                  </label>
                  <input
                    id="githubRepoUrl"
                    type="url"
                    {...register('githubRepoUrl')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.githubRepoUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://github.com/username/project"
                  />
                  {errors.githubRepoUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.githubRepoUrl.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="projectUrl"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Live Project URL
                  </label>
                  <input
                    id="projectUrl"
                    type="url"
                    {...register('projectUrl')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.projectUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://yourproject.com"
                  />
                  {errors.projectUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.projectUrl.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Visibility */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Visibility</h2>
              <div className="flex items-start gap-3">
                <input
                  id="isPublic"
                  type="checkbox"
                  {...register('isPublic')}
                  checked={isPublic}
                  onChange={(e) => setValue('isPublic', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor="isPublic" className="block text-sm font-medium text-gray-700">
                    Make this project public
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Public projects will be visible on your portfolio. Private projects are only
                    visible to you and can be used for your resume.
                  </p>
                </div>
              </div>
            </section>

            {/* Submit Buttons */}
            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : isEditMode ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;

