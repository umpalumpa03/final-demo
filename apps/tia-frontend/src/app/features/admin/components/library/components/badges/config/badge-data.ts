import { VariantBadgeItem, StatusBadgeItem, SizeBadgeItem, CountBadgeItem, DismissibleBadgeItem, PillBadgeItem } from "../models/badge-component.models";

export const VARIANTS: VariantBadgeItem[] = [
  { variant: 'default', text: 'Default', size:'medium' , shape:'rounded' },
  { variant: 'secondary', text: 'Secondary', size:'medium' , shape:'rounded' },
  { variant: 'destructive', text: 'Destructive', size:'medium' , shape:'rounded' },
  { variant: 'outline', text: 'Outline', size:'medium' , shape:'rounded' },
] as const;

export const STATUSES: StatusBadgeItem[] = [
  { status: 'active', text: 'Active', size:'medium' , shape:'rounded'  },
  { status: 'pending', text: 'Pending', size:'medium' , shape:'rounded' },
  { status: 'inactive', text: 'Inactive', size:'medium' , shape:'rounded' },
  { status: 'in-progress', text: 'In Progress', size:'medium' , shape:'rounded' },
  { status: 'featured', text: 'Featured', size:'medium' , shape:'rounded' },
  { status: 'premium', text: 'Premium', size:'medium' , shape:'rounded' },

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
  { id: '4', variant: 'outline', text: 'Tag 4' , size:'medium' , shape:'rounded' },

] as const;

export const PILL_BADGES: PillBadgeItem[] = [
  { variant: 'default', text: 'Pill Shape', size: 'medium' , shape:'pill'  },
  { variant: 'secondary', text: 'Category', size: 'medium' , shape:'pill' },
  { variant: 'outline', text: 'Tag', size: 'medium' , shape:'pill' },
  { variant: 'default', text: 'React', size: 'medium' , shape:'pill' },
  { status: 'active', text: 'TypeScript', size: 'medium' , shape:'pill' },
  { status: 'featured', text: 'CSS', size: 'medium' , shape:'pill' },
  { status: 'premium', text: 'JavaScript', size: 'medium' , shape:'pill' },
] as const;