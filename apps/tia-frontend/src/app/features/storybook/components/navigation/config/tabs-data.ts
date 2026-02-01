import { Breadcrumb } from "@tia/shared/lib/navigation/models/breadcrumbs.model";
import { NavigationItem } from "@tia/shared/lib/navigation/models/nav-bar.model";
import { PillItem } from "@tia/shared/lib/navigation/models/pills.model";
import { TabItem } from "apps/tia-frontend/src/app/shared/lib/navigation/models/tab.model";
import { Item } from "../components/models/pills-data.model";

export const TABS: TabItem[] = [
    { label: 'Overview', route: '/storybook/navigation', exact: true },
    { label: 'Analytics', route: 'test', exact: true },
    { label: 'Reports', route: 'reports', exact: true },
    { label: 'Settings', route: 'reports', exact: true }
] as const;

export const TABS2: TabItem[] = [
    { label: 'Account', icon: 'images/svg/notification-icons/account.svg', route: '/storybook/navigation', exact: true },
    { label: 'Notifications', icon: 'images/svg/notification-icons/notifications.svg', route: 'test', exact: true },
    { label: 'Preferences', icon: 'images/svg/notification-icons/setting.svg', route: '', exact: true },
] as const;

export const BREADCRUMBS: Breadcrumb[] = [
    { label: 'Home', route: '/storybook/navigation' },
    { label: 'Products', route: 'test' },
    { label: 'Current Page', route: '' },
] as const;

export const BREADCRUMBS2: Breadcrumb[] = [
    { label: 'Account', icon: 'images/svg/notification-icons/home.svg', route: '/storybook/navigation' },
    { label: 'Notifications', route: 'test' },
    { label: 'Preferences', route: '' },
] as const;


export const BREADCRUMBS3: Breadcrumb[] = [
    { label: 'Home', route: '/storybook/navigation' },
    { label: 'Dashboard', route: 'test' },
    { label: 'Settings', route: '' },
    { label: 'Security', route: '' },
    { label: 'Two-Factor Authentication', route: '' },
] as const;

export const VERTICALNAVBARS: NavigationItem[] = [
    {
        label: 'Home',
        icon: 'images/svg/notification-icons/home-gray.svg',
        route: '/storybook/navigation',
        exact: true
    },
    {
        label: 'Search',
        icon: 'images/svg/notification-icons/search.svg',
        route: 'test',
        exact: true
    },
    {
        label: 'Profile',
        icon: 'images/svg/notification-icons/profile.svg',
        route: 'reports',
        exact: true
    },
    {
        label: 'Notifications',
        icon: 'images/svg/notification-icons/notification-gray.svg',
        route: 'test',
        exact: true
    },
    {
        label: 'Settings',
        icon: 'images/svg/notification-icons/setting-gray.svg',
        route: 'reports',
        exact: true
    },
    {
        label: 'Disabled Item',
        icon: 'images/svg/notification-icons/menu-bar.svg',
        route: '/disabled',
        disabled: true,
        exact: true
    }
] as const;

export const HORIZONTALNAVBARS: NavigationItem[] = [
    { label: 'Dashboard', route: '/storybook/navigation', exact: true },
    { label: 'Projects', route: 'test', exact: true },
    { label: 'Team', route: 'reports', exact: true },
    { label: 'Calendar', route: 'test', exact: true },
    { label: 'Disabled', route: 'report', disabled: true, exact: true }
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




