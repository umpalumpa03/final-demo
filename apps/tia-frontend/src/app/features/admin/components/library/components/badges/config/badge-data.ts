import { VariantBadgeItem, StatusBadgeItem, SizeBadgeItem, CountBadgeItem } from "../models/badge-component.models";

export const VARIANTS: VariantBadgeItem[] = [
  { variant: 'default', text: 'Default' },
  { variant: 'secondary', text: 'Secondary' },
  { variant: 'destructive', text: 'Destructive' },
  { variant: 'outline', text: 'Outline' },
];

export const STATUSES: StatusBadgeItem[] = [
  { status: 'active', text: 'Active' },
  { status: 'pending', text: 'Pending' },
  { status: 'inactive', text: 'Inactive' },
  { status: 'in-progress', text: 'In Progress' },
  { status: 'featured', text: 'Featured' },
  { status: 'premium', text: 'Premium' },
];

export const SIZES: SizeBadgeItem[] = [
  { size: 'small', variant: 'default', text: 'Small' },
  { size: 'medium', variant: 'default', text: 'Medium' },
  { size: 'large', variant: 'default', text: 'Large' },
];

export const COUNT_BADGES: CountBadgeItem[] = [
  { label: 'Messages', variant: 'default', text: '3' },
  { label: 'Notifications', variant: 'destructive', text: '12' },
  { label: 'Updates', variant: 'secondary', text: 'New' },
  { label: 'Cart Items', variant: 'default', text: '5' },
  { label: 'Unread', variant: 'destructive', text: '99+' },
];