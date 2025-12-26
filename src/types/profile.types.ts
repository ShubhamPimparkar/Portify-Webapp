export interface ProfileRequest {
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

export interface ProfileResponse {
  id: string;
  email: string;
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  createdAt: string | null;
  updatedAt: string | null;
}

