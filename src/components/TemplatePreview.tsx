import { PublicPortfolioResponse } from '../types/publicPortfolio.types';
import ClassicTemplate from '../templates/ClassicTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import HeroTemplate from '../templates/HeroTemplate';
import ProductTemplate from '../templates/ProductTemplate';
import CreatorTemplate from '../templates/CreatorTemplate';

interface TemplatePreviewProps {
  portfolio: PublicPortfolioResponse;
  previewTemplateKey: string;
}

// Template registry
const templates: Record<string, React.ComponentType<{ portfolio: PublicPortfolioResponse }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  hero: HeroTemplate,
  product: ProductTemplate,
  creator: CreatorTemplate,
};

const TemplatePreview = ({ portfolio, previewTemplateKey }: TemplatePreviewProps) => {
  // Override templateKey for preview
  const previewPortfolio: PublicPortfolioResponse = {
    ...portfolio,
    settings: {
      ...portfolio.settings,
      templateKey: previewTemplateKey as 'classic' | 'modern' | 'minimal' | 'hero' | 'product' | 'creator',
    },
  };

  // Get template component, fallback to classic if unknown
  const TemplateComponent = templates[previewTemplateKey] || templates.classic;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="max-h-[600px] overflow-y-auto">
        <TemplateComponent portfolio={previewPortfolio} />
      </div>
    </div>
  );
};

export default TemplatePreview;
