import { useEffect, useRef } from 'react';
import { trackPortfolioEvent } from '../api/publicAnalytics.api';
import { AnalyticsEventType } from '../types/analyticsTracking.types';
import { API_BASE_URL } from '../config/api';

const ENGAGEMENT_THRESHOLD_SECONDS = 30; // User is "engaged" after 30 seconds
const BOUNCE_THRESHOLD_SECONDS = 5; // User "bounces" if they leave within 5 seconds
const VISITOR_ID_KEY = 'portfolio_visitor_id';

/**
 * Generates or retrieves a visitor ID from localStorage
 */
const getOrCreateVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    // Generate a simple visitor ID
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

/**
 * Hook to track portfolio analytics events
 * 
 * Tracks:
 * - VIEW: When page loads
 * - ENGAGED: When user spends time on page (scrolls/interacts)
 * - BOUNCE: When user leaves quickly
 */
export const usePortfolioTracking = (username: string | undefined) => {
  const visitorIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const engagementTrackedRef = useRef<boolean>(false);
  const bounceTrackedRef = useRef<boolean>(false);
  const scrollTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!username) return;

    // Get or create visitor ID
    visitorIdRef.current = getOrCreateVisitorId();
    startTimeRef.current = Date.now();

    // Track VIEW event immediately
    trackPortfolioEvent(
      username,
      {
        eventType: AnalyticsEventType.VIEW,
        durationSeconds: 0,
      },
      visitorIdRef.current
    );

    // Track engagement after threshold
    const engagementTimer = setTimeout(() => {
      if (!engagementTrackedRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackPortfolioEvent(
          username,
          {
            eventType: AnalyticsEventType.ENGAGED,
            durationSeconds: duration,
          },
          visitorIdRef.current || undefined
        );
        engagementTrackedRef.current = true;
      }
    }, ENGAGEMENT_THRESHOLD_SECONDS * 1000);

    // Track scroll/interaction as engagement signal
    const handleScroll = () => {
      if (!scrollTrackedRef.current && !engagementTrackedRef.current) {
        scrollTrackedRef.current = true;
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (duration >= 10) {
          // Only track if user has been on page for at least 10 seconds
          trackPortfolioEvent(
            username,
            {
              eventType: AnalyticsEventType.ENGAGED,
              durationSeconds: duration,
            },
            visitorIdRef.current || undefined
          );
          engagementTrackedRef.current = true;
        }
      }
    };

    // Track user interaction (clicks, keypresses) as engagement
    const handleInteraction = () => {
      if (!engagementTrackedRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (duration >= 10) {
          trackPortfolioEvent(
            username,
            {
              eventType: AnalyticsEventType.ENGAGED,
              durationSeconds: duration,
            },
            visitorIdRef.current || undefined
          );
          engagementTrackedRef.current = true;
        }
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    // Track bounce on page unload if user left quickly
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      // Only track bounce if:
      // 1. User hasn't been marked as engaged
      // 2. User left within bounce threshold
      if (!engagementTrackedRef.current && duration < BOUNCE_THRESHOLD_SECONDS) {
        const url = `${API_BASE_URL}/public/portfolio/${username}/track`;
        const data = JSON.stringify({
          eventType: AnalyticsEventType.BOUNCE,
          durationSeconds: duration,
          visitorId: visitorIdRef.current || undefined,
        });
        
        // Use sendBeacon for reliable tracking on page unload
        // Note: sendBeacon doesn't support custom headers, so visitorId is in body
        if (navigator.sendBeacon) {
          const blob = new Blob([data], { type: 'application/json' });
          navigator.sendBeacon(url, blob);
        } else {
          // Fallback: use fetch with keepalive
          fetch(url, {
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
          }).catch(() => {
            // Ignore errors - fail silently
          });
        }
        bounceTrackedRef.current = true;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      clearTimeout(engagementTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Track final duration on component unmount (if not already tracked)
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (!engagementTrackedRef.current && !bounceTrackedRef.current && duration >= ENGAGEMENT_THRESHOLD_SECONDS) {
        trackPortfolioEvent(
          username,
          {
            eventType: AnalyticsEventType.ENGAGED,
            durationSeconds: duration,
          },
          visitorIdRef.current || undefined
        );
      }
    };
  }, [username]);
};

