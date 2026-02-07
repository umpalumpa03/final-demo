import {
  BadgeStatus,
  BadgeDotType,
  BadgeSkill,
  BadgeCategory,
  BadgeVariant,
 } from '../models/badges.models';

export const statusClassMap: Record<BadgeStatus, string> = {
  'active': 'badge--active',
  'pending': 'badge--pending',
  'inactive': 'badge--inactive',
  'in-progress': 'badge--in-progress',
  'featured': 'badge--featured',
  'premium': 'badge--premium',
  'favorite': 'badge--favorite',
  'done': 'badge--done',
  'todo': 'badge--todo',
};

export const statusIconMap: Record<BadgeStatus, string> = {
  'active': 'images/svg/badges/badges-active.svg',
  'pending': 'images/svg/badges/badges-pending.svg',
  'inactive': 'images/svg/badges/badges-inactive.svg',
  'in-progress': 'images/svg/badges/badges-inProgress.svg',
  'featured': 'images/svg/badges/badges-featured.svg',
  'premium': 'images/svg/badges/badges-premium.svg',
  'favorite': 'images/svg/badges/badges-featured.svg',
  'done': '',
  'todo': '',
};

export const statusAltTextMap: Record<BadgeStatus, string> = {
  'active': 'Active status icon',
  'pending': 'Pending status icon',
  'inactive': 'Inactive status icon',
  'in-progress': 'In progress status icon',
  'featured': 'Featured status icon',
  'premium': 'Premium status icon',
  'favorite': 'Favorite status icon',
  'done': 'Done status icon',
  'todo': 'Todo status icon',
};

export const statusTextMap: Record<BadgeStatus, string> = {
  'active': 'Active',
  'pending': 'Pending',
  'inactive': 'Inactive',
  'in-progress': 'In Progress',
  'featured': 'Featured',
  'premium': 'Premium',
  'favorite': 'Favorite',
  'done': 'Done',
  'todo': 'Todo',
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

interface BadgePresetConfig {
  text: string;
  variant: BadgeVariant;
}

interface CategoryPresetConfig {
  text: string;
}

export const skillPresetMap: Record<BadgeSkill, BadgePresetConfig> = {
  javascript: { text: 'JavaScript', variant: 'outline' },
  react: { text: 'React', variant: 'outline' },
  nodejs: { text: 'Node.js', variant: 'outline' },
  typescript: { text: 'TypeScript', variant: 'outline' },
  css: { text: 'CSS', variant: 'outline' },
  html: { text: 'HTML', variant: 'outline' },
};

export const categoryPresetMap: Record<BadgeCategory, CategoryPresetConfig> = {
  technology: { text: 'Technology' },
  design: { text: 'Design' },
  marketing: { text: 'Marketing' },
};