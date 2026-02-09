import { TranslateService } from '@ngx-translate/core';
import { TimelineDisplayItem } from '../../../../../shared/lib/data-display/models/timeline-display.models';

export const getTimelineItems = (translate: TranslateService): TimelineDisplayItem[] => [
  {
    id: 'deploy',
    title: translate.instant('storybook.data-display.sections.timelineDisplay.items.deployTitle'),
    timestamp: translate.instant('storybook.data-display.sections.timelineDisplay.items.deployTimestamp'),
    tone: 'green',
  },
  {
    id: 'review',
    title: translate.instant('storybook.data-display.sections.timelineDisplay.items.reviewTitle'),
    timestamp: translate.instant('storybook.data-display.sections.timelineDisplay.items.reviewTimestamp'),
    tone: 'green',
  },
  {
    id: 'pr',
    title: translate.instant('storybook.data-display.sections.timelineDisplay.items.prTitle'),
    timestamp: translate.instant('storybook.data-display.sections.timelineDisplay.items.prTimestamp'),
    tone: 'orange',
  },
  {
    id: 'feature',
    title: translate.instant('storybook.data-display.sections.timelineDisplay.items.featureTitle'),
    timestamp: translate.instant('storybook.data-display.sections.timelineDisplay.items.featureTimestamp'),
    tone: 'blue',
  },
];
