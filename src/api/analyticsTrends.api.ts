import axiosInstance from './axios';
import { AnalyticsTrendsResponse } from '../types/analyticsTrends.types';

export const getAnalyticsTrends = async (): Promise<AnalyticsTrendsResponse> => {
  const response = await axiosInstance.get<AnalyticsTrendsResponse>('/dashboard/analytics/trends');
  return response.data;
};

