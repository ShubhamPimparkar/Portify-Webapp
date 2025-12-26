import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResumePreview, downloadResumePDF } from '../api/resume.api';
import { ResumePreviewResponse } from '../types/resume.types';
import ResumePreview from '../components/ResumePreview';
import Loader from '../components/Loader';

const Resume = () => {
  const [resume, setResume] = useState<ResumePreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getResumePreview();
      setResume(data);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 404) {
          // Resume data not available (missing profile or projects)
          setError('incomplete');
        } else {
          setError(axiosError.response?.data?.message || 'Failed to load resume');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resume) return;

    setIsDownloading(true);
    try {
      await downloadResumePDF(resume.header.fullName);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to download resume');
      } else {
        setError('Failed to download resume');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <Loader />
      </div>
    );
  }

  if (error === 'incomplete' || (resume && (!resume.header.fullName || resume.projects.length === 0))) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Complete your profile and add projects to generate your resume
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Your resume requires a complete profile and at least one project to be generated.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/profile')}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Go to Profile
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Go to Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && error !== 'incomplete') {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return null;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Resume Preview</h1>
            <p className="text-sm text-gray-600">
              This is how your resume will appear to recruiters
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>

        <ResumePreview resume={resume} />
      </div>
    </div>
  );
};

export default Resume;

