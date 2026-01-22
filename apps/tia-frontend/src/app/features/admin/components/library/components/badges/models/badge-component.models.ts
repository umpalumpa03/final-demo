import { BadgeStatus, BadgeSize, BadgeVariant, BadgeShape } from '../../../../../../../shared/lib/primitives/badges/models/badges.models';

export interface VariantBadgeItem {
  variant: BadgeVariant;
  text: string;
  size?: BadgeSize;
  shape?: BadgeShape;
}

export interface StatusBadgeItem {
  status: BadgeStatus;
  text: string;
  size?: BadgeSize;
  shape?: BadgeShape;
}

export interface SizeBadgeItem {
  size: BadgeSize;
  variant: BadgeVariant;
  text: string;
  shape?: BadgeShape;
}

export interface CountBadgeItem {
  label: string;
  variant: BadgeVariant;
  text: string;
  size?: BadgeSize;
  shape?: BadgeShape;
}

export interface DismissibleBadgeItem {
  id: string;
  variant?: BadgeVariant;
  status?: BadgeStatus;
  size?: BadgeSize;
  shape?: BadgeShape;
  text: string;
}

export interface PillBadgeItem {
  variant?: BadgeVariant;
  status?: BadgeStatus;
  text: string;
  size?: BadgeSize;
  shape?: BadgeShape;
}