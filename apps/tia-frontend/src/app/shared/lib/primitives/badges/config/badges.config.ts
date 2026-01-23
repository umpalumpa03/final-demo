import { BadgeStatus } from '../models/badges.models';
import { BadgeDotType } from '../models/badges.models';

export const statusClassMap: Record<BadgeStatus, string> = {
  'active': 'badge--active',
  'pending': 'badge--pending',
  'inactive': 'badge--inactive',
  'in-progress': 'badge--in-progress',
  'featured': 'badge--featured',
  'premium': 'badge--premium',
};

export const statusIconMap: Record<BadgeStatus, string> = {
  'active': 'images/svg/badges/badges-active.svg',
  'pending': 'images/svg/badges/badges-pending.svg',
  'inactive': 'images/svg/badges/badges-inactive.svg',
  'in-progress': 'images/svg/badges/badges-inProgress.svg',
  'featured': 'images/svg/badges/badges-featured.svg',
  'premium': 'images/svg/badges/badges-premium.svg',
};

export const statusAltTextMap: Record<BadgeStatus, string> = {
  'active': 'Active status icon',
  'pending': 'Pending status icon',
  'inactive': 'Inactive status icon',
  'in-progress': 'In progress status icon',
  'featured': 'Featured status icon',
  'premium': 'Premium status icon',
};

export const statusTextMap: Record<BadgeStatus, string> = {
  'active': 'Active',
  'pending': 'Pending',
  'inactive': 'Inactive',
  'in-progress': 'In Progress',
  'featured': 'Featured',
  'premium': 'Premium',
};



export const dotColorMap: Record<BadgeDotType, string> = {
  'online': 'green-400',
  'away': 'yellow-400',
  'offline': 'red-500',
  'live': 'blue-200',
};

export const dotTextMap: Record<BadgeDotType, string> = {
  'online': 'Online',
  'away': 'Away',
  'offline': 'Offline',
  'live': 'Live',
};