export type HoverCardTriggerVariant = 'link' | 'button';

export interface HoverCardItem {
  handle: string;
  initials: string;
  name: string;
  role: string;
  detail: string;
  variant: HoverCardTriggerVariant;
}

export const HOVER_CARD_ITEMS: HoverCardItem[] = [
  {
    handle: '@johndoe',
    initials: 'JD',
    name: 'John Doe',
    role: 'Product Designer',
    detail: 'Building thoughtful UI patterns for the data display suite.',
    variant: 'link',
  },
  {
    handle: '@janedoe',
    initials: 'JA',
    name: 'Jane Adams',
    role: 'Frontend Engineer',
    detail: 'Focused on accessible, reusable hover interactions.',
    variant: 'link',
  },
  {
    handle: 'Hover for details',
    initials: 'AD',
    name: 'Alex Diaz',
    role: 'Design Lead',
    detail: 'Exploring rich previews for documentation content.',
    variant: 'button',
  },
];
