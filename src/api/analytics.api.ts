import axiosInstance from './axios';
import { DashboardAnalyticsResponse } from '../types/analytics.types';

export const getDashboardAnalytics = async (): Promise<DashboardAnalyticsResponse> => {
  const response = await axiosInstance.get<DashboardAnalyticsResponse>('/dashboard/analytics');
  return response.data;
};

