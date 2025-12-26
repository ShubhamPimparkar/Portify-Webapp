export interface PublicProfile {
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

export interface PublicProject {
  title: string;
  role: string;
  description: string;
  techStack: string[];
  projectUrl: string;
  githubRepoUrl: string;
}

export interface PublicEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface PublicAchievement {
  title: string;
  issuer?: string;
  issueDate?: string;
  description?: string;
  link?: string;
}

export interface PortfolioSettings {
  templateKey: 'classic' | 'modern' | 'minimal' | 'hero' | 'product' | 'creator';
  primaryColor: string | null;
  fontFamily: string | null;
  showSkills: boolean;
  showProjects: boolean;
  showEducation?: boolean;
  showAchievements?: boolean;
}

export interface PublicPortfolioResponse {
  profile: PublicProfile;
  projects: PublicProject[];
  education?: PublicEducation[];
  achievements?: PublicAchievement[];
  settings: PortfolioSettings;
}

