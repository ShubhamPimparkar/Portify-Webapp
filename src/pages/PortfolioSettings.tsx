import { useState, useEffect } from 'react';
import { getPortfolioSettings, updatePortfolioSettings } from '../api/portfolioSettings.api';
import { PortfolioSettings as PortfolioSettingsType, PortfolioSettingsRequest } from '../types/portfolioSettings.types';
import TemplateCard from '../components/TemplateCard';
import Loader from '../components/Loader';

const PortfolioSettings = () => {
  const [, setSettings] = useState<PortfolioSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [templateKey, setTemplateKey] = useState<'classic' | 'modern' | 'minimal' | 'hero' | 'product' | 'creator'>('classic');
  const [showSkills, setShowSkills] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showEducation, setEducation] = useState(true);
  const [showAchievements, setAchievements] = useState(true);
  const [primaryColor, setPrimaryColor] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPortfolioSettings();
      setSettings(data);
      // Populate form state
      setTemplateKey(data.templateKey);
      setShowSkills(data.showSkills);
      setShowProjects(data.showProjects);
      setEducation(data.showEducation);
      setAchievements(data.showAchievements);
      setPrimaryColor(data.primaryColor || '');
      setFontFamily(data.fontFamily || '');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to load portfolio settings');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const requestData: PortfolioSettingsRequest = {
        templateKey,
        showSkills,
        showProjects,
        showEducation,
        showAchievements,
        primaryColor: primaryColor.trim() || null,
        fontFamily: fontFamily.trim() || null,
      };

      const updatedSettings = await updatePortfolioSettings(requestData);
      setSettings(updatedSettings);
      setSuccessMessage('Portfolio settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to save portfolio settings');
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Portfolio Settings</h1>
          <p className="text-sm text-gray-600">
            Customize how your public portfolio looks
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

        <div className="space-y-8">
          {/* Template Selection */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Template Selection</h2>
            <p className="text-sm text-gray-600 mb-6">
              Choose a template for your public portfolio
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TemplateCard
                name="Classic"
                description="Resume-like, single column layout with neutral typography"
                isSelected={templateKey === 'classic'}
                onClick={() => setTemplateKey('classic')}
              />
              <TemplateCard
                name="Modern"
                description="Card-based sections with subtle shadows and accent colors"
                isSelected={templateKey === 'modern'}
                onClick={() => setTemplateKey('modern')}
              />
              <TemplateCard
                name="Minimal"
                description="Typography-first design with maximum whitespace"
                isSelected={templateKey === 'minimal'}
                onClick={() => setTemplateKey('minimal')}
              />
              <TemplateCard
                name="Hero"
                description="Modern personal website with hero section and clear CTAs"
                isSelected={templateKey === 'hero'}
                onClick={() => setTemplateKey('hero')}
              />
              <TemplateCard
                name="Product"
                description="SaaS landing page style with clean cards and sections"
                isSelected={templateKey === 'product'}
                onClick={() => setTemplateKey('product')}
              />
              <TemplateCard
                name="Creator"
                description="Personal brand website with editorial-style layout"
                isSelected={templateKey === 'creator'}
                onClick={() => setTemplateKey('creator')}
              />
            </div>
          </section>

          {/* Visibility Toggles */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Visibility</h2>
            <p className="text-sm text-gray-600 mb-6">
              Control which sections appear on your public portfolio
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label htmlFor="showSkills" className="block text-sm font-medium text-gray-700">
                    Show Skills
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Display your skills section on the portfolio
                  </p>
                </div>
                <button
                  type="button"
                  id="showSkills"
                  onClick={() => setShowSkills(!showSkills)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    showSkills ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      showSkills ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label htmlFor="showProjects" className="block text-sm font-medium text-gray-700">
                    Show Projects
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Display your projects section on the portfolio
                  </p>
                </div>
                <button
                  type="button"
                  id="showProjects"
                  onClick={() => setShowProjects(!showProjects)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    showProjects ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      showProjects ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label htmlFor="showEducation" className="block text-sm font-medium text-gray-700">
                    Show Education
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Display your Education section on the portfolio
                  </p>
                </div>
                <button
                  type="button"
                  id="showEducation"
                  onClick={() => setEducation(!showEducation)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    showEducation ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      showEducation ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label htmlFor="showAchievements" className="block text-sm font-medium text-gray-700">
                    Show Achievements
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Display your Achievements section on the portfolio
                  </p>
                </div>
                <button
                  type="button"
                  id="setAchievements"
                  onClick={() => setAchievements(!showAchievements)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    showAchievements ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      showAchievements ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Appearance Options */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Appearance</h2>
            <p className="text-sm text-gray-600 mb-6">
              Optional customization options
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Primary Color
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Hex color code (e.g., #3b82f6). Leave empty to use template default.
                </p>
                <input
                  id="primaryColor"
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Font Family
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  CSS font family (e.g., "Inter", "Roboto"). Leave empty to use template default.
                </p>
                <input
                  id="fontFamily"
                  type="text"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  placeholder="Inter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSettings;
