import axiosInstance from './axios';
import { AchievementRequest, AchievementResponse } from '../types/achievement.types';

export const getAchievements = async (): Promise<AchievementResponse[]> => {
  const response = await axiosInstance.get<AchievementResponse[]>('/profile/achievements');
  return response.data;
};

export const createAchievement = async (
  data: AchievementRequest
): Promise<AchievementResponse> => {
  const response = await axiosInstance.post<AchievementResponse>('/profile/achievements', data);
  return response.data;
};

export const updateAchievement = async (
  id: string,
  data: AchievementRequest
): Promise<AchievementResponse> => {
  const response = await axiosInstance.put<AchievementResponse>(
    `/profile/achievements/${id}`,
    data
  );
  return response.data;
};

export const deleteAchievement = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/profile/achievements/${id}`);
};

