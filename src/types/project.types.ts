export interface ProjectRequest {
  title: string;
  description: string;
  techStack: string[];
  projectUrl: string;
  githubRepoUrl: string;
  role: string;
  isPublic: boolean;
}

export interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  projectUrl: string;
  githubRepoUrl: string;
  role: string;
  isPublic: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

