import axiosInstance from './axios';
import { PublicPortfolioResponse } from '../types/publicPortfolio.types';

export const getPublicPortfolio = async (username: string): Promise<PublicPortfolioResponse> => {
  const response = await axiosInstance.get<PublicPortfolioResponse>(`/public/${username}`);
  return response.data;
};

