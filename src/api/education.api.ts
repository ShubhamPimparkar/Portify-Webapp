import axiosInstance from './axios';
import { EducationRequest, EducationResponse } from '../types/education.types';

export const getEducation = async (): Promise<EducationResponse[]> => {
  const response = await axiosInstance.get<EducationResponse[]>('/profile/education');
  return response.data;
};

export const createEducation = async (data: EducationRequest): Promise<EducationResponse> => {
  const response = await axiosInstance.post<EducationResponse>('/profile/education', data);
  return response.data;
};

export const updateEducation = async (
  id: string,
  data: EducationRequest
): Promise<EducationResponse> => {
  const response = await axiosInstance.put<EducationResponse>(`/profile/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/profile/education/${id}`);
};

