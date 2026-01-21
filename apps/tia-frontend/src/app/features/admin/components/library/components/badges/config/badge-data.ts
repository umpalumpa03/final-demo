import { signal } from '@angular/core';
import { VariantBadgeItem, StatusBadgeItem, SizeBadgeItem, CountBadgeItem } from "../models/badge-component.models";

export const variantsData = signal<VariantBadgeItem[]>([
  { variant: 'default', text: 'Default' },
  { variant: 'secondary', text: 'Secondary' },
  { variant: 'destructive', text: 'Destructive' },
  { variant: 'outline', text: 'Outline' },
]);

export const statusesData = signal<StatusBadgeItem[]>([
  { status: 'active', text: 'Active' },
  { status: 'pending', text: 'Pending' },
  { status: 'inactive', text: 'Inactive' },
  { status: 'in-progress', text: 'In Progress' },
  { status: 'featured', text: 'Featured' },
  { status: 'premium', text: 'Premium' },
]);

export const sizesData = signal<SizeBadgeItem[]>([
  { size: 'small', variant: 'default', text: 'Small' },
  { size: 'medium', variant: 'default', text: 'Medium' },
  { size: 'large', variant: 'default', text: 'Large' },
]);

export const countBadgesData = signal<CountBadgeItem[]>([
  { label: 'Messages', variant: 'default', text: '3' },
  { label: 'Notifications', variant: 'destructive', text: '12' },
  { label: 'Updates', variant: 'secondary', text: 'New' },
  { label: 'Cart Items', variant: 'default', text: '5' },
  { label: 'Unread', variant: 'destructive', text: '99+' },
]);