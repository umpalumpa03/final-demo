import {
  BadgeStatus,
  BadgeSize,
  BadgeVariant,
  BadgeShape,
  BadgeDotType,
  BadgeSkill,
  BadgeCategory,
  BadgeCustomColor,
} from '../../../../../shared/lib/primitives/badges/models/badges.models';

export interface BaseBadgeItem {
  text?: string;
  size?: BadgeSize;
  shape?: BadgeShape;
}

export interface VariantBadgeItem extends BaseBadgeItem {
  variant: BadgeVariant;
  text: string;
}

export interface StatusBadgeItem extends BaseBadgeItem {
  status: BadgeStatus;
}

export interface SizeBadgeItem extends BaseBadgeItem {
  size: BadgeSize;
  variant: BadgeVariant;
  text: string;
}

export interface CountBadgeItem extends BaseBadgeItem {
  label: string;
  variant: BadgeVariant;
  text: string;
}

export interface DismissibleBadgeItem extends BaseBadgeItem {
  id: string;
  variant?: BadgeVariant;
  status?: BadgeStatus;
  customColor?: BadgeCustomColor;
  text: string;
}

export interface PillBadgeItem extends BaseBadgeItem {
  variant?: BadgeVariant;
  status?: BadgeStatus;
  customColor?: BadgeCustomColor;
  text: string;
}

export interface DotBadgeItem extends BaseBadgeItem {
  dot: BadgeDotType;
  variant?: BadgeVariant;
}

export interface SkillBadgeItem {
  skill: BadgeSkill;
  size?: BadgeSize;
}

export interface CategoryBadgeItem {
  category: BadgeCategory;
  size?: BadgeSize;
}

export interface BadgeStateItem extends BaseBadgeItem {
  id: string;
  text: string;
  disabled?: boolean;
  selected?: boolean;
  variant?: BadgeVariant;
  customColor?: BadgeCustomColor;
  hoverable?: boolean;
  clickable?: boolean;
}

export interface CustomColorBadgeItem extends BaseBadgeItem {
  customColor: BadgeCustomColor;
  text: string;
}