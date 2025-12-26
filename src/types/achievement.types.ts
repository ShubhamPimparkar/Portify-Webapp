export interface AchievementRequest {
  title: string;
  issuer?: string;
  issueDate?: string; // ISO date string (YYYY-MM-DD)
  description?: string;
  link?: string;
}

export interface AchievementResponse {
  id: string;
  userId: string;
  title: string;
  issuer?: string;
  issueDate?: string; // ISO date string or null
  description?: string;
  link?: string;
  createdAt: string;
}

