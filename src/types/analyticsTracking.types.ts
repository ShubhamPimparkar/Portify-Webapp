export enum AnalyticsEventType {
  VIEW = 'VIEW',
  ENGAGED = 'ENGAGED',
  // BOUNCE is derived server-side, not sent from frontend
}

export interface AnalyticsTrackingRequest {
  eventType: AnalyticsEventType;
  durationSeconds?: number;
  scrollDepth?: number; // Percentage (0-100)
  visitorId?: string;
}

