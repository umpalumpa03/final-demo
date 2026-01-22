import { BadgeStatus, BadgeSize, BadgeVariant } from '../../../../../../../shared/lib/primitives/badges/models/badges.models';

export interface VariantBadgeItem {
  variant: BadgeVariant;
  text: string;
}

export interface StatusBadgeItem {
  status: BadgeStatus;
  text: string;
}

export interface SizeBadgeItem {
  size: BadgeSize;
  variant: BadgeVariant;
  text: string;
}

export interface CountBadgeItem {
  label: string;
  variant: BadgeVariant;
  text: string;
}
