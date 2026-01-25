export type TimelineDisplayTone = 'blue' | 'green' | 'orange' | 'gray';

export interface TimelineDisplayItem {
  id: string;
  title: string;
  timestamp: string;
  detail?: string;
  tone?: TimelineDisplayTone;
}
