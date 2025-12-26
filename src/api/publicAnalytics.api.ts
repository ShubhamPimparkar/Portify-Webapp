import axios from 'axios';
import { AnalyticsTrackingRequest } from '../types/analyticsTracking.types';
import { API_BASE_URL } from '../config/api';

// Create a separate axios instance for public tracking (no auth required)
const publicAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Shorter timeout for tracking
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Tracks analytics events for a public portfolio.
 * This endpoint does not require authentication and fails silently.
 */
export const trackPortfolioEvent = async (
  username: string,
  request: AnalyticsTrackingRequest,
  visitorId?: string
): Promise<void> => {
  try {
    const headers: Record<string, string> = {};
    if (visitorId) {
      headers['X-Visitor-Id'] = visitorId;
    }

    await publicAxiosInstance.post(
      `/public/portfolio/${username}/track`,
      {
        ...request,
        visitorId: visitorId || request.visitorId,
      },
      { headers }
    );
  } catch (error) {
    // Fail silently - never block portfolio rendering
    console.debug('Analytics tracking failed (silent):', error);
  }
};

