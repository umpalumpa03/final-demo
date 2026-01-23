import { AspectRatioItem } from '../../../../../../../shared/lib/data-display/aspect-ratio/models/aspect-ratio.models';

export const ASPECT_RATIO_ITEMS: AspectRatioItem[] = [
  {
    id: 'video',
    label: '16:9',
    description: 'Video',
    ratio: '16 / 9',
    width: '44.8rem',
    background: 'var(--color-muted)',
  },
  {
    id: 'standard',
    label: '4:3',
    description: 'Standard',
    ratio: '4 / 3',
    width: '33.6rem',
    background: 'var(--color-secondary)',
  },
  {
    id: 'square',
    label: '1:1',
    description: 'Square',
    ratio: '1 / 1',
    width: '25.2rem',
    background: 'var(--color-accent)',
  },
  {
    id: 'ultrawide',
    label: '21:9',
    description: 'Ultrawide',
    ratio: '21 / 9',
    width: '58.8rem',
    background: 'var(--color-primary)',
  },
];
