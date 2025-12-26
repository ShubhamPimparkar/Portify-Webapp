import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getProfile, createProfile, updateProfile } from '../api/profile.api';
import { ProfileRequest, ProfileResponse } from '../types/profile.types';
import SkillInput from '../components/SkillInput';
import Loader from '../components/Loader';
import EducationList from '../components/education/EducationList';
import AchievementList from '../components/achievements/AchievementList';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  headline: z.string().min(1, 'Headline is required'),
  summary: z.string(),
  location: z.string(),
  yearsOfExperience: z.number().min(0).max(50),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  githubUrl: z.string().url('Invalid GitHub URL').or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').or(z.literal('')),
  portfolioUrl: z.string().url('Invalid portfolio URL').or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      headline: '',
      summary: '',
      location: '',
      yearsOfExperience: 0,
      skills: [],
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
    },
  });

  const skills = watch('skills');

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profileData = await getProfile();
        if (profileData) {
          setProfile(profileData);
          // Pre-fill form
          setValue('fullName', profileData.fullName);
          setValue('headline', profileData.headline);
          setValue('summary', profileData.summary);
          setValue('location', profileData.location);
          setValue('yearsOfExperience', profileData.yearsOfExperience);
          setValue('skills', profileData.skills);
          setValue('githubUrl', profileData.githubUrl);
          setValue('linkedinUrl', profileData.linkedinUrl);
          setValue('portfolioUrl', profileData.portfolioUrl);
        }
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as { response?: { data?: { message?: string } } };
          setError(axiosError.response?.data?.message || 'Failed to load profile');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const profileData: ProfileRequest = {
        fullName: data.fullName,
        headline: data.headline,
        summary: data.summary,
        location: data.location,
        yearsOfExperience: data.yearsOfExperience,
        skills: data.skills,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        portfolioUrl: data.portfolioUrl,
      };

      let updatedProfile: ProfileResponse;
      if (profile) {
        updatedProfile = await updateProfile(profileData);
      } else {
        updatedProfile = await createProfile(profileData);
      }

      setProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to save profile');
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Profile</h1>
          <p className="text-sm text-gray-600">
            This information will be used for your resume and portfolio
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {saveSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              Profile saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register('fullName')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="headline"
                    type="text"
                    {...register('headline')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.headline ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Senior Software Engineer"
                  />
                  {errors.headline && (
                    <p className="mt-1 text-sm text-red-600">{errors.headline.message}</p>
                  )}
                </div>

                {profile && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    {...register('location')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="San Francisco, CA"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="yearsOfExperience"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Years of Experience
                  </label>
                  <input
                    id="yearsOfExperience"
                    type="number"
                    {...register('yearsOfExperience', { valueAsNumber: true })}
                    min="0"
                    max="50"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.yearsOfExperience ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="5"
                  />
                  {errors.yearsOfExperience && (
                    <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Professional Summary */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Summary</h2>
              <div>
                <textarea
                  id="summary"
                  rows={6}
                  {...register('summary')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.summary ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Write a brief summary of your professional background and expertise..."
                />
                {errors.summary && (
                  <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
                )}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>
              <SkillInput
                skills={skills}
                onChange={(newSkills) => setValue('skills', newSkills)}
                error={errors.skills?.message}
              />
            </section>

            {/* Links */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Links</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    id="githubUrl"
                    type="url"
                    {...register('githubUrl')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.githubUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://github.com/username"
                  />
                  {errors.githubUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.githubUrl.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    id="linkedinUrl"
                    type="url"
                    {...register('linkedinUrl')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.linkedinUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://linkedin.com/in/username"
                  />
                  {errors.linkedinUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Portfolio URL
                  </label>
                  <input
                    id="portfolioUrl"
                    type="url"
                    {...register('portfolioUrl')}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.portfolioUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://yourportfolio.com"
                  />
                  {errors.portfolioUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.portfolioUrl.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <EducationList />
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <AchievementList />
        </div>
      </div>
    </div>
  );
};

export default Profile;

