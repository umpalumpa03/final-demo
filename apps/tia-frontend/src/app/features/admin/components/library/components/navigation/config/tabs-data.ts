import { Breadcrumb } from "@tia/shared/lib/navigation/models/breadcrumbs.model";
import { NavigationItem } from "@tia/shared/lib/navigation/models/nav-bar.model";
import { PillItem } from "@tia/shared/lib/navigation/models/pills.model";
import { TabItem } from "apps/tia-frontend/src/app/shared/lib/navigation/models/tab.model";
import { Item } from "../components/models/pills-data.model";

export const TABS: TabItem[] = [
    { label: 'Overview', route: '/admin/library/navigation' },
    { label: 'Analytics', route: 'test' },
    { label: 'Reports', route: 'reports' },
    { label: 'Settings', route: '' }
] as const;

export const TABS2: TabItem[] = [
    { label: 'Account', icon: 'images/svg/notification-icons/account.svg', route: '/admin/library/navigation' },
    { label: 'Notifications', icon: 'images/svg/notification-icons/notifications.svg', route: 'test' },
    { label: 'Preferences', icon: 'images/svg/notification-icons/setting.svg', route: '' },
] as const;

export const BREADCRUMBS: Breadcrumb[] = [
    { label: 'Home', route: '/admin/library/navigation' },
    { label: 'Products', route: 'test' },
    { label: 'Current Page', route: '' },
] as const;

export const BREADCRUMBS2: Breadcrumb[] = [
    { label: 'Account', icon: 'images/svg/notification-icons/home.svg', route: '/admin/library/navigation' },
    { label: 'Notifications', route: 'test' },
    { label: 'Preferences', route: '' },
] as const;


export const BREADCRUMBS3: Breadcrumb[] = [
    { label: 'Home', route: '/admin/library/navigation' },
    { label: 'Dashboard', route: 'test' },
    { label: 'Settings', route: '' },
    { label: 'Security', route: '' },
    { label: 'Two-Factor Authentication', route: '' },
] as const;

export const VERTICALNAVBARS: NavigationItem[] = [
    {
        label: 'Home',
        icon: 'images/svg/notification-icons/home-gray.svg',
        route: '/admin/library/navigation'
    },
    {
        label: 'Search',
        icon: 'images/svg/notification-icons/search.svg',
        route: 'test'
    },
    {
        label: 'Profile',
        icon: 'images/svg/notification-icons/profile.svg',
        route: 'reports'
    },
    {
        label: 'Notifications',
        icon: 'images/svg/notification-icons/notification-gray.svg',
        route: 'test'
    },
    {
        label: 'Settings',
        icon: 'images/svg/notification-icons/setting-gray.svg',
        route: 'reports'
    },
    {
        label: 'Disabled Item',
        icon: 'images/svg/notification-icons/menu-bar.svg',
        route: '/disabled',
        disabled: true
    }
] as const;

export const HORIZONTALNAVBARS: NavigationItem[] = [
    { label: 'Dashboard', route: '/admin/library/navigation' },
    { label: 'Projects', route: 'test' },
    { label: 'Team', route: 'reports' },
    { label: 'Calendar', route: 'test' },
    { label: 'Disabled', route: 'report', disabled: true }
] as const;

export const PILLARRAY: PillItem[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'archived', label: 'Archived' }
] as const;

export const ITEMS: Item[] = [
  { id: 1, status: 'active', name: 'Task 1' },
  { id: 2, status: 'completed', name: 'Task 2' },
  { id: 3, status: 'archived', name: 'Task 3' },
  { id: 4, status: 'active', name: 'Task 4' },
  { id: 5, status: 'completed', name: 'Task 5' }
] as const;




