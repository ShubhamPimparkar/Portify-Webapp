import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicPortfolio } from '../api/public.api';
import { PublicPortfolioResponse } from '../types/publicPortfolio.types';
import ClassicTemplate from '../templates/ClassicTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import HeroTemplate from '../templates/HeroTemplate';
import ProductTemplate from '../templates/ProductTemplate';
import CreatorTemplate from '../templates/CreatorTemplate';
import Loader from '../components/Loader';
import { usePortfolioTracking } from '../utils/portfolioTracking';

// Template registry
const templates: Record<string, React.ComponentType<{ portfolio: PublicPortfolioResponse }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  hero: HeroTemplate,
  product: ProductTemplate,
  creator: CreatorTemplate,
};

const PublicPortfolio = () => {
  const { username } = useParams<{ username: string }>();
  const [portfolio, setPortfolio] = useState<PublicPortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track portfolio analytics (VIEW, ENGAGED, BOUNCE)
  usePortfolioTracking(username);

  useEffect(() => {
    if (username) {
      loadPortfolio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const loadPortfolio = async () => {
    if (!username) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getPublicPortfolio(username);
      setPortfolio(data);
      
      // Update page title and meta description
      document.title = `${data.profile.fullName} | Developer`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', data.profile.summary || `${data.profile.fullName} - ${data.profile.headline}`);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 404) {
          setError('not-found');
        } else {
          setError(axiosError.response?.data?.message || 'Failed to load portfolio');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (error === 'not-found' || !username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Portfolio not found</h1>
          <p className="text-lg text-gray-600">
            The portfolio you're looking for doesn't exist or is not available.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-lg text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  // Get template component, fallback to classic if unknown
  const TemplateComponent = templates[portfolio.settings.templateKey] || templates.classic;

  return <TemplateComponent portfolio={portfolio} />;
};

export default PublicPortfolio;
