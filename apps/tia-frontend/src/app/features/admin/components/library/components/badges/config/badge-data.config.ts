import {
  VariantBadgeItem,
  StatusBadgeItem,
  SizeBadgeItem,
  CountBadgeItem,
  DismissibleBadgeItem,
  PillBadgeItem,
  DotBadgeItem,
  SkillBadgeItem,
  CategoryBadgeItem,
  BadgeStateItem,
  CustomColorBadgeItem,
} from "../models/badge-component.models";

export const VARIANTS: VariantBadgeItem[] = [
  { variant: 'default', text: 'Default', size:'medium' , shape:'rounded' },
  { variant: 'secondary', text: 'Secondary', size:'medium' , shape:'rounded' },
  { variant: 'destructive', text: 'Destructive', size:'medium' , shape:'rounded' },
  { variant: 'outline', text: 'Outline', size:'medium' , shape:'rounded' },
] as const;

export const STATUSES: StatusBadgeItem[] = [
  { status: 'active', size: 'medium' },
  { status: 'pending', size: 'medium' },
  { status: 'inactive', size: 'medium' },
  { status: 'in-progress', size: 'medium' },
  { status: 'featured', size: 'medium' },
  { status: 'premium', size: 'medium' },
] as const;

export const SIZES: SizeBadgeItem[] = [
  { size: 'small', variant: 'default', text: 'Small' , shape:'rounded' },
  { size: 'medium', variant: 'default', text: 'Medium' , shape:'rounded' },
  { size: 'large', variant: 'default', text: 'Large' , shape:'rounded' },
] as const  ;

export const COUNT_BADGES: CountBadgeItem[] = [
  { label: 'Messages', variant: 'default', text: '3' , size:'medium' , shape:'rounded' },
  { label: 'Notifications', variant: 'destructive', text: '12' , size:'medium' , shape:'rounded' },
  { label: 'Updates', variant: 'secondary', text: 'New' , size:'medium' , shape:'rounded' },
  { label: 'Cart Items', variant: 'default', text: '5' , size:'medium' , shape:'rounded' },
  { label: 'Unread', variant: 'destructive', text: '99+', size:'medium' , shape:'rounded' },
] as const;

export const DISMISSIBLE_BADGES: DismissibleBadgeItem[] = [
  { id: '1', variant: 'default', text: 'Tag 1' , size:'medium' , shape:'rounded' },
  { id: '2', variant: 'secondary', text: 'Tag 2' , size:'medium' , shape:'rounded' },
  { id: '3', variant: 'default', text: 'Tag 3' , size:'medium' , shape:'rounded' },
  { id: '4', customColor: 'indigo', text: 'Tag 4' , size:'medium' , shape:'rounded' },

] as const;

export const PILL_BADGES: PillBadgeItem[] = [
  { variant: 'default', text: 'Pill Shape', size: 'medium' , shape:'pill'  },
  { variant: 'secondary', text: 'Category', size: 'medium' , shape:'pill' },
  { variant: 'outline', text: 'Tag', size: 'medium' , shape:'pill' },
  { variant: 'default', text: 'React', size: 'medium' , shape:'pill' },
  { customColor: 'lime', text: 'TypeScript', size: 'medium' , shape:'pill' },
  { customColor: 'indigo', text: 'CSS', size: 'medium' , shape:'pill' },
  { customColor: 'amber', text: 'JavaScript', size: 'medium' , shape:'pill' },
] as const;

export const DOT_BADGES: DotBadgeItem[] = [
  { dot: 'online', size: 'medium' },
  { dot: 'away', variant: 'secondary', size: 'medium' },
  { dot: 'offline', variant: 'secondary', size: 'medium' },
  { dot: 'live', size: 'medium' },
] as const;

export const SKILL_BADGES: SkillBadgeItem[] = [
  { skill: 'javascript', size: 'medium' },
  { skill: 'react', size: 'medium' },
  { skill: 'nodejs', size: 'medium' },
  { skill: 'typescript', size: 'medium' },
  { skill: 'css', size: 'medium' },
  { skill: 'html', size: 'medium' },
] as const;

export const CATEGORY_BADGES: CategoryBadgeItem[] = [
  { category: 'technology', size: 'medium' },
  { category: 'design', size: 'medium' },
  { category: 'marketing', size: 'medium' },
] as const;

export const BADGE_STATES: BadgeStateItem[] = [
  { id: 'default', text: 'Normal Badge', size: 'medium', shape: 'rounded' },
  { id: 'hover', text: 'Hover Me', size: 'medium', shape: 'rounded' },
  { id: 'disabled', text: 'Disabled', size: 'medium', shape: 'rounded', disabled: true },
  { id: 'selected', text: 'Selected', size: 'medium', shape: 'pill', selected: true },
] as const;

export const CUSTOM_COLORS: CustomColorBadgeItem[] = [
  { customColor: 'pink', text: 'Pink', size: 'medium', shape: 'rounded' },
  { customColor: 'indigo', text: 'Indigo', size: 'medium', shape: 'rounded' },
  { customColor: 'teal', text: 'Teal', size: 'medium', shape: 'rounded' },
  { customColor: 'rose', text: 'Rose', size: 'medium', shape: 'rounded' },
  { customColor: 'cyan', text: 'Cyan', size: 'medium', shape: 'rounded' },
  { customColor: 'amber', text: 'Amber', size: 'medium', shape: 'rounded' },
  { customColor: 'lime', text: 'Lime', size: 'medium', shape: 'rounded' },
  { customColor: 'slate', text: 'Slate', size: 'medium', shape: 'rounded' },
] as const;