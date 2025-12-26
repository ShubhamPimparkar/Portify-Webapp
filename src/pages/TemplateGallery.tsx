import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getPortfolioSettings, updatePortfolioSettings } from '../api/portfolioSettings.api';
import { getPublicPortfolio } from '../api/public.api';
import { PublicPortfolioResponse } from '../types/publicPortfolio.types';
import { PortfolioSettings } from '../types/portfolioSettings.types';
import TemplatePreview from '../components/TemplatePreview';
import GalleryTemplateCard from '../components/GalleryTemplateCard';
import Loader from '../components/Loader';

const TEMPLATES = [
  {
    key: 'classic',
    name: 'Classic',
    description: 'Resume-like, single column layout with neutral typography',
  },
  {
    key: 'modern',
    name: 'Modern',
    description: 'Card-based sections with subtle shadows and accent colors',
  },
  {
    key: 'minimal',
    name: 'Minimal',
    description: 'Typography-first design with maximum whitespace',
  },
  {
    key: 'hero',
    name: 'Hero',
    description: 'Modern personal website with hero section and clear CTAs',
  },
  {
    key: 'product',
    name: 'Product',
    description: 'SaaS landing page style with clean cards and sections',
  },
  {
    key: 'creator',
    name: 'Creator',
    description: 'Personal brand website with editorial-style layout',
  },
];

const TemplateGallery = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PublicPortfolioResponse | null>(null);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('classic');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.username) return;

    setIsLoading(true);
    setError(null);
    try {
      // Load settings to get current template
      const settingsData = await getPortfolioSettings();
      setSettings(settingsData);
      setSelectedTemplateKey(settingsData.templateKey);

      // Load portfolio data for preview
      const portfolioData = await getPublicPortfolio(user.username);
      setPortfolio(portfolioData);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to load template gallery');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (templateKey: string) => {
    setSelectedTemplateKey(templateKey);
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    if (!settings || selectedTemplateKey === settings.templateKey) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedSettings = await updatePortfolioSettings({
        ...settings,
        templateKey: selectedTemplateKey as any,
      });
      setSettings(updatedSettings);
      setSuccessMessage('Template saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to save template');
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

  if (!portfolio || !settings) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            Unable to load portfolio data. Please ensure your profile is complete.
          </div>
        </div>
      </div>
    );
  }

  const isTemplateSaved = selectedTemplateKey === settings.templateKey;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Portfolio Template</h1>
          <p className="text-sm text-gray-600">
            Preview how your portfolio will look before publishing
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Templates</h2>
              <div className="space-y-3">
                {TEMPLATES.map((template) => (
                  <GalleryTemplateCard
                    key={template.key}
                    name={template.name}
                    description={template.description}
                    templateKey={template.key}
                    isSelected={selectedTemplateKey === template.key}
                    isSaved={settings.templateKey === template.key}
                    onClick={() => handleTemplateSelect(template.key)}
                  />
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={isSaving || isTemplateSaved}
                  className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Saving...' : isTemplateSaved ? 'Template Saved' : 'Save Template'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Preview</h2>
                <span className="text-sm text-gray-500">
                  {TEMPLATES.find((t) => t.key === selectedTemplateKey)?.name}
                </span>
              </div>
              {portfolio && (
                <TemplatePreview
                  portfolio={portfolio}
                  previewTemplateKey={selectedTemplateKey}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
