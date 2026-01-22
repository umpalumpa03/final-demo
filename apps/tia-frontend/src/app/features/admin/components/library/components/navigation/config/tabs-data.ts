import { Breadcrumb } from "@tia/shared/lib/navigation/models/breadcrumbs.model";
import { TabItem } from "apps/tia-frontend/src/app/shared/lib/navigation/models/tab.model";

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