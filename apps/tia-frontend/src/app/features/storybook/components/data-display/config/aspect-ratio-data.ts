import { TranslateService } from '@ngx-translate/core';
import { AspectRatioItem } from '../../../../../shared/lib/data-display/models/aspect-ratio.models';

export const getAspectRatioItems = (translate: TranslateService): AspectRatioItem[] => [
  {
    id: 'video',
    label: '16:9',
    description: translate.instant('storybook.data-display.sections.aspectRatio.descriptions.video'),
    ratio: '16 / 9',
    width: '44.8rem',
    background: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
  },
  {
    id: 'standard',
    label: '4:3',
    description: translate.instant('storybook.data-display.sections.aspectRatio.descriptions.standard'),
    ratio: '4 / 3',
    width: '33.6rem',
    background: 'var(--color-secondary)',
  },
  {
    id: 'square',
    label: '1:1',
    description: translate.instant('storybook.data-display.sections.aspectRatio.descriptions.square'),
    ratio: '1 / 1',
    width: '25.2rem',
    background: 'var(--color-accent)',
  },
  {
    id: 'ultrawide',
    label: '21:9',
    description: translate.instant('storybook.data-display.sections.aspectRatio.descriptions.ultrawide'),
    ratio: '21 / 9',
    width: '58.8rem',
    background: 'var(--color-muted)',
  },
];
