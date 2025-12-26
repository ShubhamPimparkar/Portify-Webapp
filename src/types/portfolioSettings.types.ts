export interface PortfolioSettings {
  templateKey: 'classic' | 'modern' | 'minimal' | 'hero' | 'product' | 'creator';
  primaryColor: string | null;
  fontFamily: string | null;
  showProjects: boolean;
  showSkills: boolean;
  showEducation: boolean;
  showAchievements: boolean;
}

export interface PortfolioSettingsRequest {
  templateKey: 'classic' | 'modern' | 'minimal' | 'hero' | 'product' | 'creator';
  primaryColor: string | null;
  fontFamily: string | null;
  showProjects: boolean;
  showSkills: boolean;
  showEducation: boolean;
  showAchievements: boolean;
}
