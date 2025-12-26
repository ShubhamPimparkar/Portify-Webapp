import axiosInstance from './axios';
import { ProjectRequest, ProjectResponse } from '../types/project.types';

export const getProjects = async (): Promise<ProjectResponse[]> => {
  const response = await axiosInstance.get<ProjectResponse[]>('/projects/me');
  return response.data;
};

export const createProject = async (data: ProjectRequest): Promise<ProjectResponse> => {
  const response = await axiosInstance.post<ProjectResponse>('/projects', data);
  return response.data;
};

export const updateProject = async (id: string, data: ProjectRequest): Promise<ProjectResponse> => {
  const response = await axiosInstance.put<ProjectResponse>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/projects/${id}`);
};

