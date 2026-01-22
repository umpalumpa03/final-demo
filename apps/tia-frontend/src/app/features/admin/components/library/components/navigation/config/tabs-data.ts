import { TabItem } from "apps/tia-frontend/src/app/shared/lib/navigation/models/tab.model";

export const TABS: TabItem[] = [
    { label: 'Overview', route: '/admin/library/navigation' },
    { label: 'Analytics', route: 'test' },
    { label: 'Reports', route: 'reports' },
    { label: 'Settings', route: '' }
];

export const TABS2: TabItem[] = [
    { label: 'Account', icon: 'svg/notification-icons/account.svg', route: '/admin/library/navigation' },
    { label: 'Notifications', icon: 'svg/notification-icons/notifications.svg', route: 'test' },
    { label: 'Preferences', icon: 'svg/notification-icons/setting.svg', route: '' },
];