import {
  AvatarGroupItem,
  AvatarUserProfile,
} from '../../../../../shared/lib/data-display/models/avatar.model';

export const AVATAR_SIZES = [
  { size: 'xs', label: 'XS' },
  { size: 'sm', label: 'SM' },
  { size: 'md', label: 'MD' },
  { size: 'lg', label: 'LG' },
  { size: 'xl', label: 'XL' },
] as const;

export const LOGGED_IN_USER: AvatarUserProfile = {
  firstName: 'Nikoloz',
  lastName: 'Maghaldadze',
};

export const ADDITIONAL_USERS: AvatarUserProfile[] = [
  { firstName: 'Alex', lastName: 'Brown' },
  { firstName: 'Mia', lastName: 'Johnson' },
  { firstName: 'Sophia', lastName: 'King' },
];

export const COLOR_AVATARS: AvatarGroupItem[] = [
  { initials: 'JD', tone: 'solid', color: 'blue' },
  { initials: 'AB', tone: 'solid', color: 'green' },
  { initials: 'MJ', tone: 'solid', color: 'purple' },
  { initials: 'SK', tone: 'solid', color: 'orange' },
  { initials: 'EW', tone: 'solid', color: 'pink' },
];

export const GROUP_AVATARS: AvatarGroupItem[] = [
  { initials: 'JC', tone: 'soft', color: 'blue' },
  { initials: 'AE', tone: 'soft', color: 'blue' },
  { initials: 'MS', tone: 'soft', color: 'blue' },
  { initials: 'SH', tone: 'soft', color: 'blue' },
  { initials: 'LW', tone: 'soft', color: 'blue' },
  { initials: 'BM', tone: 'soft', color: 'blue' },
  { initials: 'RG', tone: 'soft', color: 'blue' },
  { initials: 'TW', tone: 'soft', color: 'blue' },
  { initials: 'NP', tone: 'soft', color: 'blue' },
];

export const STATUS_AVATARS: AvatarGroupItem[] = [
  { initials: 'JD', status: 'online', tone: 'soft', color: 'blue' },
  { initials: 'AB', status: 'away', tone: 'soft', color: 'blue' },
  { initials: 'MJ', status: 'busy', tone: 'soft', color: 'blue' },
  { initials: 'SK', status: 'offline', tone: 'soft', color: 'blue' },
];
