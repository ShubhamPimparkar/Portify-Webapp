import axiosInstance from './axios';
import { ResumePreviewResponse } from '../types/resume.types';

export const getResumePreview = async (): Promise<ResumePreviewResponse> => {
  const response = await axiosInstance.get<ResumePreviewResponse>('/resume/preview');
  return response.data;
};

export const downloadResumePDF = async (fullName: string): Promise<void> => {
  const response = await axiosInstance.get('/resume/download', {
    responseType: 'blob',
  });

  // Create blob and trigger download
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fullName.replace(/\s+/g, '-')}-resume.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

