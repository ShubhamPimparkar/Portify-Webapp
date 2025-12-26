export enum AnalyticsEventType {
  VIEW = 'VIEW',
  ENGAGED = 'ENGAGED',
  BOUNCE = 'BOUNCE',
}

export interface AnalyticsTrackingRequest {
  eventType: AnalyticsEventType;
  durationSeconds: number;
  visitorId?: string;
}

