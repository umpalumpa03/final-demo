import { TimelineDisplayItem } from '../../../../../shared/lib/data-display/models/timeline-display.models';

export const TIMELINE_ITEMS: TimelineDisplayItem[] = [
  {
    id: 'deploy',
    title: 'Deployed to production',
    timestamp: '2 hours ago',
    tone: 'green',
  },
  {
    id: 'review',
    title: 'Code review completed',
    timestamp: '5 hours ago',
    tone: 'green',
  },
  {
    id: 'pr',
    title: 'Pull request opened',
    timestamp: '1 day ago',
    tone: 'orange',
  },
  {
    id: 'feature',
    title: 'Feature development started',
    timestamp: '2 days ago',
    tone: 'blue',
  }
];
