import { TranslateService } from '@ngx-translate/core';
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

export const getVariants = (translate: TranslateService): VariantBadgeItem[] => [
  { variant: 'default', text: translate.instant('storybook.badges.variants.default'), size:'medium' , shape:'rounded' },
  { variant: 'secondary', text: translate.instant('storybook.badges.variants.secondary'), size:'medium' , shape:'rounded' },
  { variant: 'destructive', text: translate.instant('storybook.badges.variants.destructive'), size:'medium' , shape:'rounded' },
  { variant: 'outline', text: translate.instant('storybook.badges.variants.outline'), size:'medium' , shape:'rounded' },
];

export const STATUSES: StatusBadgeItem[] = [
  { status: 'active', size: 'medium' },
  { status: 'pending', size: 'medium' },
  { status: 'inactive', size: 'medium' },
  { status: 'in-progress', size: 'medium' },
  { status: 'featured', size: 'medium' },
  { status: 'premium', size: 'medium' },
 
] as const;

export const getSizes = (translate: TranslateService): SizeBadgeItem[] => [
  { size: 'small', variant: 'default', text: translate.instant('storybook.badges.sizes.small') , shape:'rounded' },
  { size: 'medium', variant: 'default', text: translate.instant('storybook.badges.sizes.medium') , shape:'rounded' },
  { size: 'large', variant: 'default', text: translate.instant('storybook.badges.sizes.large') , shape:'rounded' },
];

export const getCountBadges = (translate: TranslateService): CountBadgeItem[] => [
  { label: translate.instant('storybook.badges.countBadges.messages'), variant: 'default', text: '3' , size:'medium' , shape:'rounded' },
  { label: translate.instant('storybook.badges.countBadges.notifications'), variant: 'destructive', text: '12' , size:'medium' , shape:'rounded' },
  { label: translate.instant('storybook.badges.countBadges.updates'), variant: 'secondary', text: translate.instant('storybook.badges.countBadges.new') , size:'medium' , shape:'rounded' },
  { label: translate.instant('storybook.badges.countBadges.cartItems'), variant: 'default', text: '5' , size:'medium' , shape:'rounded' },
  { label: translate.instant('storybook.badges.countBadges.unread'), variant: 'destructive', text: '99+', size:'medium' , shape:'rounded' },
];

export const getDismissibleBadges = (translate: TranslateService): DismissibleBadgeItem[] => [
  { id: '1', variant: 'default', text: translate.instant('storybook.badges.dismissible.tag1') , size:'medium' , shape:'rounded' },
  { id: '2', variant: 'secondary', text: translate.instant('storybook.badges.dismissible.tag2') , size:'medium' , shape:'rounded' },
  { id: '3', variant: 'default', text: translate.instant('storybook.badges.dismissible.tag3') , size:'medium' , shape:'rounded' },
  { id: '4', customColor: 'indigo', text: translate.instant('storybook.badges.dismissible.tag4') , size:'medium' , shape:'rounded' },
];

export const getPillBadges = (translate: TranslateService): PillBadgeItem[] => [
  { variant: 'default', text: translate.instant('storybook.badges.pillBadges.pillShape'), size: 'medium' , shape:'pill'  },
  { variant: 'secondary', text: translate.instant('storybook.badges.pillBadges.category'), size: 'medium' , shape:'pill' },
  { variant: 'outline', text: translate.instant('storybook.badges.pillBadges.tag'), size: 'medium' , shape:'pill' },
  { variant: 'default', text: translate.instant('storybook.badges.pillBadges.angular'), size: 'medium' , shape:'pill' },
  { customColor: 'lime', text: translate.instant('storybook.badges.pillBadges.typescript'), size: 'medium' , shape:'pill' },
  { customColor: 'indigo', text: translate.instant('storybook.badges.pillBadges.css'), size: 'medium' , shape:'pill' },
  { customColor: 'amber', text: translate.instant('storybook.badges.pillBadges.javascript'), size: 'medium' , shape:'pill' },
];

export const DOT_BADGES: DotBadgeItem[] = [
  { dot: 'online', size: 'medium' },
  { dot: 'away', variant: 'secondary', size: 'medium' },
  { dot: 'offline', variant: 'secondary', size: 'medium' },
  { dot: 'live', size: 'medium' },
] as const;

export const SKILL_BADGES: SkillBadgeItem[] = [
  { skill: 'javascript', size: 'medium' },
  { skill: 'angular', size: 'medium' },
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

export const getBadgeStates = (translate: TranslateService): BadgeStateItem[] => [
  { id: 'default', text: translate.instant('storybook.badges.badgeStates.normal'), size: 'medium', shape: 'rounded' },
  { id: 'hover', text: translate.instant('storybook.badges.badgeStates.hoverMe'), size: 'medium', shape: 'rounded', hoverable: true },
  { id: 'disabled', text: translate.instant('storybook.badges.badgeStates.disabled'), size: 'medium', shape: 'rounded', disabled: true },
  { id: 'selected', text: translate.instant('storybook.badges.badgeStates.selected'), size: 'medium', shape: 'pill', selected: true, clickable: true },
];

export const getCustomColors = (translate: TranslateService): CustomColorBadgeItem[] => [
  { customColor: 'pink', text: translate.instant('storybook.badges.customColors.pink'), size: 'medium', shape: 'rounded' },
  { customColor: 'indigo', text: translate.instant('storybook.badges.customColors.indigo'), size: 'medium', shape: 'rounded' },
  { customColor: 'teal', text: translate.instant('storybook.badges.customColors.teal'), size: 'medium', shape: 'rounded' },
  { customColor: 'rose', text: translate.instant('storybook.badges.customColors.rose'), size: 'medium', shape: 'rounded' },
  { customColor: 'cyan', text: translate.instant('storybook.badges.customColors.cyan'), size: 'medium', shape: 'rounded' },
  { customColor: 'amber', text: translate.instant('storybook.badges.customColors.amber'), size: 'medium', shape: 'rounded' },
  { customColor: 'lime', text: translate.instant('storybook.badges.customColors.lime'), size: 'medium', shape: 'rounded' },
  { customColor: 'slate', text: translate.instant('storybook.badges.customColors.slate'), size: 'medium', shape: 'rounded' },
];