import axiosInstance from './axios';
import { ProfileRequest, ProfileResponse } from '../types/profile.types';

export const getProfile = async (): Promise<ProfileResponse | null> => {
  try {
    const response = await axiosInstance.get<ProfileResponse>('/profile/me');
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      // Return null if profile doesn't exist (404)
      if (axiosError.response?.status === 404) {
        return null;
      }
    }
    throw error;
  }
};

export const createProfile = async (data: ProfileRequest): Promise<ProfileResponse> => {
  const response = await axiosInstance.post<ProfileResponse>('/profile', data);
  return response.data;
};

export const updateProfile = async (data: ProfileRequest): Promise<ProfileResponse> => {
  const response = await axiosInstance.put<ProfileResponse>('/profile', data);
  return response.data;
};

