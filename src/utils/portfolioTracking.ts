import { useEffect, useRef } from 'react';
import { trackPortfolioEvent } from '../api/publicAnalytics.api';
import { AnalyticsEventType } from '../types/analyticsTracking.types';

const ENGAGEMENT_THRESHOLD_SECONDS = 30; // User is "engaged" after 30 seconds OR scroll depth >= 50%
const ENGAGEMENT_SCROLL_DEPTH_PERCENT = 50; // Scroll depth threshold for engagement
const VISITOR_ID_KEY = 'portfolio_visitor_id';

/**
 * Generates a UUID v4 compliant visitor ID
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Generates or retrieves a visitor ID from localStorage
 * Uses UUID format for better uniqueness and privacy
 */
const getOrCreateVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    // Generate a UUID v4 compliant visitor ID
    visitorId = generateUUID();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

/**
 * Calculates scroll depth as a percentage (0-100)
 */
const calculateScrollDepth = (): number => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
  const scrollableHeight = documentHeight - windowHeight;
  if (scrollableHeight <= 0) return 100; // Page fits in viewport
  
  const scrollDepth = Math.round((scrollTop / scrollableHeight) * 100);
  return Math.min(100, Math.max(0, scrollDepth));
};

/**
 * Hook to track portfolio analytics events
 * 
 * Tracks:
 * - VIEW: When page loads
 * - ENGAGED: When user meets engagement criteria:
 *   - Duration >= 30 seconds, OR
 *   - Scroll depth >= 50%, OR
 *   - User clicks on project/GitHub/LinkedIn links
 * 
 * Note: BOUNCE is derived server-side (VIEW without ENGAGED)
 */
export const usePortfolioTracking = (username: string | undefined) => {
  const visitorIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const engagementTrackedRef = useRef<boolean>(false);
  const maxScrollDepthRef = useRef<number>(0);
  const scrollCheckIntervalRef = useRef<number | null>(null);
  const viewTrackedRef = useRef<boolean>(false);
  const pageVisibilityRef = useRef<boolean>(true);
  const hiddenTimeRef = useRef<number>(0);
  const totalHiddenTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!username) return;

    // Get or create visitor ID (UUID format)
    visitorIdRef.current = getOrCreateVisitorId();
    startTimeRef.current = Date.now();
    maxScrollDepthRef.current = 0;
    totalHiddenTimeRef.current = 0;
    viewTrackedRef.current = false;

    // Track page visibility changes to exclude hidden time from duration
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page became hidden - record the time
        hiddenTimeRef.current = Date.now();
        pageVisibilityRef.current = false;
      } else {
        // Page became visible - add hidden duration to total
        if (hiddenTimeRef.current > 0) {
          const hiddenDuration = Date.now() - hiddenTimeRef.current;
          totalHiddenTimeRef.current += hiddenDuration;
          hiddenTimeRef.current = 0;
        }
        pageVisibilityRef.current = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Calculate actual time spent (excluding hidden time)
    const getActualDuration = (): number => {
      const currentTime = Date.now();
      const totalTime = currentTime - startTimeRef.current;
      const actualDuration = Math.floor((totalTime - totalHiddenTimeRef.current) / 1000);
      return Math.max(0, actualDuration);
    };

    // Track VIEW event after a small delay to ensure page is loaded
    // This gives a more accurate representation of actual page view
    const viewTimer = setTimeout(() => {
      if (!viewTrackedRef.current && visitorIdRef.current) {
        const initialDuration = getActualDuration();
        trackPortfolioEvent(
          username,
          {
            eventType: AnalyticsEventType.VIEW,
            durationSeconds: initialDuration,
            scrollDepth: calculateScrollDepth(),
          },
          visitorIdRef.current
        );
        viewTrackedRef.current = true;
      }
    }, 1000); // 1 second delay to ensure page is actually viewed

    // Helper function to mark as engaged and clean up
    const markAsEngaged = (duration: number, scrollDepth: number) => {
      if (!engagementTrackedRef.current && visitorIdRef.current) {
        trackPortfolioEvent(
          username,
          {
            eventType: AnalyticsEventType.ENGAGED,
            durationSeconds: duration,
            scrollDepth: scrollDepth,
          },
          visitorIdRef.current
        );
        engagementTrackedRef.current = true;
        
        // Clear scroll check interval once engaged
        if (scrollCheckIntervalRef.current) {
          clearInterval(scrollCheckIntervalRef.current);
          scrollCheckIntervalRef.current = null;
        }
      }
    };

    // Track engagement after duration threshold (30 seconds of actual visible time)
    // Use interval to check actual duration (excluding hidden time)
    const checkEngagementByDuration = () => {
      if (!engagementTrackedRef.current && visitorIdRef.current && pageVisibilityRef.current) {
        const duration = getActualDuration();
        if (duration >= ENGAGEMENT_THRESHOLD_SECONDS) {
          markAsEngaged(duration, maxScrollDepthRef.current);
        }
      }
    };

    // Check engagement every 5 seconds (more efficient than setTimeout)
    const engagementCheckInterval = setInterval(checkEngagementByDuration, 5000);

    // Track scroll depth periodically to detect engagement via scroll
    const checkScrollDepth = () => {
      if (!engagementTrackedRef.current && visitorIdRef.current && pageVisibilityRef.current) {
        const scrollDepth = calculateScrollDepth();
        maxScrollDepthRef.current = Math.max(maxScrollDepthRef.current, scrollDepth);
        
        // If scroll depth >= 50%, mark as engaged
        if (scrollDepth >= ENGAGEMENT_SCROLL_DEPTH_PERCENT) {
          const duration = getActualDuration();
          markAsEngaged(duration, scrollDepth);
        }
      }
    };

    // Check scroll depth every 2 seconds (only when page is visible)
    scrollCheckIntervalRef.current = setInterval(checkScrollDepth, 2000);

    // Track user interaction (clicks on links) as engagement signal
    // This handles clicks on project cards, GitHub links, LinkedIn links, etc.
    const handleInteraction = (event: MouseEvent) => {
      if (!engagementTrackedRef.current && visitorIdRef.current) {
        const target = event.target as HTMLElement;
        const link = target.closest('a');
        
        // If user clicks on any link (project, GitHub, LinkedIn, etc.), mark as engaged
        if (link) {
          const duration = getActualDuration();
          const scrollDepth = calculateScrollDepth();
          maxScrollDepthRef.current = Math.max(maxScrollDepthRef.current, scrollDepth);
          markAsEngaged(duration, maxScrollDepthRef.current);
        }
      }
    };

    // Add event listeners
    window.addEventListener('click', handleInteraction, { capture: true });

    // Cleanup
    return () => {
      clearTimeout(viewTimer);
      clearInterval(engagementCheckInterval);
      if (scrollCheckIntervalRef.current) {
        clearInterval(scrollCheckIntervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('click', handleInteraction, { capture: true });

      // Final check: if user spent enough time but wasn't marked as engaged,
      // check if they met engagement criteria before leaving
      if (!engagementTrackedRef.current && visitorIdRef.current) {
        const duration = getActualDuration();
        const finalScrollDepth = calculateScrollDepth();
        maxScrollDepthRef.current = Math.max(maxScrollDepthRef.current, finalScrollDepth);
        
        // Only send ENGAGED if criteria are met
        if (duration >= ENGAGEMENT_THRESHOLD_SECONDS || 
            maxScrollDepthRef.current >= ENGAGEMENT_SCROLL_DEPTH_PERCENT) {
          trackPortfolioEvent(
            username,
            {
              eventType: AnalyticsEventType.ENGAGED,
              durationSeconds: duration,
              scrollDepth: maxScrollDepthRef.current,
            },
            visitorIdRef.current
          );
        }
      }
    };
  }, [username]);
};

