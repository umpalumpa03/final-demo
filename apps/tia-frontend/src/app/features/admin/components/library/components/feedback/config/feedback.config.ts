// feedback.config.ts
import { SkeletonVariant } from '../../../../../../../shared/lib/feedback/models/skeleton.model';

export interface SkeletonItem {
  width: string;
  height: string;
  variant?: SkeletonVariant;
}

export interface AvatarItem {
  height: string;
  variant: SkeletonVariant;
}

export interface LoadingCard {
  width: string;
  height: string;
  avatar?: AvatarItem;
  credentials: SkeletonItem[];
  content: SkeletonItem[];
}

export interface ListItem {
  avatar: AvatarItem;
  credentials: SkeletonItem[];
}

export const LOADING_CARDS: LoadingCard[] = [
  {
    width: '32.8rem',
    height: '23.8rem',
    credentials: [
      { width: '19.6rem', height: '1.6rem' },
      { width: '13.1rem', height: '1.2rem' }
    ],
    content: [
      { width: '100%', height: '8rem' },
      { width: '100%', height: '2.4rem' }
    ]
  },
  {
    width: '32.8rem',
    height: '23.8rem',
    avatar: { height: '4.8rem', variant: 'circle' },
    credentials: [
      { width: '19.6rem', height: '1.6rem' },
      { width: '13.1rem', height: '1.2rem' }
    ],
    content: [
      { width: '100%', height: '1.2rem' },
      { width: '100%', height: '1.2rem' },
      { width: '80%', height: '1.2rem' }
    ]
  }
];

export const TEXT_SKELETONS: SkeletonItem[] = [
  { width: '44.8rem', height: '1.6rem' },
  { width: '37.3rem', height: '1.6rem' },
  { width: '30.3rem', height: '1.6rem' }
];

export const IMAGE_SKELETONS: SkeletonItem[] = [
  { width: '13.8rem', height: '9.6rem' },
  { width: '13.8rem', height: '9.6rem' },
  { width: '13.8rem', height: '9.6rem' }
];

export const LIST_ITEMS: ListItem[] = Array(3).fill({
  avatar: { height: '4rem', variant: 'circle' },
  credentials: [
    { width: '29.4rem', height: '1.6rem' },
    { width: '19.6rem', height: '1.2rem' }
  ]
});
