import axiosInstance from './axios';
import { PortfolioSettings, PortfolioSettingsRequest } from '../types/portfolioSettings.types';

export const getPortfolioSettings = async (): Promise<PortfolioSettings> => {
  const response = await axiosInstance.get<PortfolioSettings>('/portfolio/settings');
  return response.data;
};

export const updatePortfolioSettings = async (data: PortfolioSettingsRequest): Promise<PortfolioSettings> => {
  const response = await axiosInstance.put<PortfolioSettings>('/portfolio/settings', data);
  return response.data;
};
