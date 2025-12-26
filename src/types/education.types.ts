export interface EducationRequest {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate?: string; // ISO date string (YYYY-MM-DD) or null for ongoing
  grade?: string;
  description?: string;
}

export interface EducationResponse {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string or null
  grade?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

