export interface ResumeHeader {
  fullName: string;
  headline: string;
  email: string;
  location: string;
  yearsOfExperience: number;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

export interface ResumeProject {
  title: string;
  role: string;
  description: string;
  techStack: string[];
  projectUrl: string;
  githubRepoUrl: string;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface ResumeAchievement {
  title: string;
  issuer?: string;
  issueDate?: string;
  description?: string;
  link?: string;
}

export interface ResumePreviewResponse {
  header: ResumeHeader;
  professionalSummary: string;
  skills: string[];
  projects: ResumeProject[];
  education?: ResumeEducation[];
  achievements?: ResumeAchievement[];
}

