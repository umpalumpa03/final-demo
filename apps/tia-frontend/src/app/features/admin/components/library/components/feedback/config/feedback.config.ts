import { SkeletonVariant } from '../../../../../../../shared/lib/feedback/models/skeleton.model';

export interface SkeletonItem {
  id: string;
  width: string;
  height: string;
  variant?: SkeletonVariant;
}

export interface AvatarItem {
  height: string;
  variant: SkeletonVariant;
}

export interface LoadingCard {
  id: string;
  width: string;
  height: string;
  avatar?: AvatarItem;
  credentials: SkeletonItem[];
  content: SkeletonItem[];
}

export interface ListItem {
  id: string;
  avatar: AvatarItem;
  credentials: SkeletonItem[];
}

export const LOADING_CARDS: LoadingCard[] = [
  {
    id: 'card-1',
    width: '100%',
    height: '23.8rem',
    credentials: [
      { id: 'cred-1-1', width: '100%', height: '1.6rem' },
      { id: 'cred-1-2', width: '80%', height: '1.2rem' }
    ],
    content: [
      { id: 'content-1-1', width: '100%', height: '8rem' },
      { id: 'content-1-2', width: '100%', height: '2.4rem' }
    ]
  },
  {
    id: 'card-2',
    width: '100%',
    height: '23.8rem',
    avatar: { height: '4.8rem', variant: 'circle' },
    credentials: [
      { id: 'cred-2-1', width: '100%', height: '1.6rem' },
      { id: 'cred-2-2', width: '70%', height: '1.2rem' }
    ],
    content: [
      { id: 'content-2-1', width: '100%', height: '1.2rem' },
      { id: 'content-2-2', width: '100%', height: '1.2rem' },
      { id: 'content-2-3', width: '80%', height: '1.2rem' }
    ]
  }
];


export const TEXT_SKELETONS: SkeletonItem[] = [
  { id: 'text-1', width: '100%', height: '1.6rem' },
  { id: 'text-2', width: '90%', height: '1.6rem' },
  { id: 'text-3', width: '80%', height: '1.6rem' }
];

export const IMAGE_SKELETONS: SkeletonItem[] = [
  { id: 'img-1', width: '13.8rem', height: '9.6rem' },
  { id: 'img-2', width: '13.8rem', height: '9.6rem' },
  { id: 'img-3', width: '13.8rem', height: '9.6rem' }
];

export const LIST_ITEMS: ListItem[] = [
  {
    id: 'list-1',
    avatar: { height: '4rem', variant: 'circle' },
    credentials: [
      { id: 'list-cred-1-1', width: '100%', height: '1.6rem' },
      { id: 'list-cred-1-2', width: '80%', height: '1.2rem' }
    ]
  },
  {
    id: 'list-2',
    avatar: { height: '4rem', variant: 'circle' },
    credentials: [
      { id: 'list-cred-2-1', width: '100%', height: '1.6rem' },
      { id: 'list-cred-2-2', width: '80%', height: '1.2rem' }
    ]
  },
  {
    id: 'list-3',
    avatar: { height: '4rem', variant: 'circle' },
    credentials: [
      { id: 'list-cred-3-1', width: '100%', height: '1.6rem' },
      { id: 'list-cred-3-2', width: '80%', height: '1.2rem' }
    ]
  }
];
