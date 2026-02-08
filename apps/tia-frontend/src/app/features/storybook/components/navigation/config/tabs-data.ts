import { Breadcrumb } from "@tia/shared/lib/navigation/models/breadcrumbs.model";
import { NavigationItem } from "@tia/shared/lib/navigation/models/nav-bar.model";
import { PillItem } from "@tia/shared/lib/navigation/models/pills.model";
import { TabItem } from "apps/tia-frontend/src/app/shared/lib/navigation/models/tab.model";
import { Item } from "../components/models/pills-data.model";
import { TranslateService } from "@ngx-translate/core";

export const TABS = (translate: TranslateService): TabItem[] => [
    { label: translate.instant('storybook.navigation.sections.tabs.analytics'), route: '/storybook/navigation', exact: true },
    { label: translate.instant('storybook.navigation.sections.tabs.reports'), route: 'reports', exact: true },
    { label: translate.instant('storybook.navigation.sections.tabs.settings'), route: 'test', exact: true }
];

export const TABS2 = (translate: TranslateService): TabItem[] => [
    { label: translate.instant('storybook.navigation.sections.verticalTabs.account'), icon: 'images/svg/notification-icons/account.svg', route: '/storybook/navigation', exact: true },
    { label: translate.instant('storybook.navigation.sections.verticalTabs.notifications'), icon: 'images/svg/notification-icons/notifications.svg', route: 'test', exact: true },
    { label: translate.instant('storybook.navigation.sections.verticalTabs.preferences'), icon: 'images/svg/notification-icons/setting.svg', route: 'reports', exact: true },
];

export const BREADCRUMBS = (translate: TranslateService): Breadcrumb[] => [
    { label: translate.instant('storybook.navigation.sections.breadcrumbs.home'), route: '/storybook/navigation' },
    { label: translate.instant('storybook.navigation.sections.breadcrumbs.products'), route: 'test' },
    { label: translate.instant('storybook.navigation.sections.breadcrumbs.current'), route: '' },
];

export const BREADCRUMBS2 = (translate: TranslateService): Breadcrumb[] => [
    { label: translate.instant('storybook.navigation.sections.breadcrumbs.home'), icon: 'images/svg/notification-icons/home.svg', route: '/storybook/navigation' },
    { label: translate.instant('storybook.navigation.sections.verticalTabs.notifications'), route: 'test' },
    { label: translate.instant('storybook.navigation.sections.verticalTabs.preferences'), route: '' },
];

export const BREADCRUMBS3 = (translate: TranslateService): Breadcrumb[] => [
    { label: translate.instant('storybook.navigation.sections.breadcrumbs.home'), route: '/storybook/navigation' },
    { label: translate.instant('storybook.navigation.sections.breadcrumbs.dashboard'), route: 'test' },
    { label: translate.instant('storybook.navigation.sections.breadcrumbs.settings'), route: '' },
    { label: translate.instant('storybook.navigation.sections.breadcrumbs.security'), route: '' },
    { label: translate.instant('storybook.navigation.sections.breadcrumbs.twoFactorAuth'), route: '' },
];

export const VERTICALNAVBARS = (translate: TranslateService): NavigationItem[] => [
    {
        label: translate.instant('storybook.navigation.sections.verticalNavigation.home'),
        icon: 'images/svg/notification-icons/home-gray.svg',
        route: '/storybook/navigation',
        exact: true
    },
    {
        label: translate.instant('storybook.navigation.sections.verticalNavigation.search'),
        icon: 'images/svg/notification-icons/search.svg',
        route: 'test',
        exact: true
    },
    {
        label: translate.instant('storybook.navigation.sections.verticalNavigation.profile'),
        icon: 'images/svg/notification-icons/profile.svg',
        route: 'reports',
        exact: true
    },
    {
        label: translate.instant('storybook.navigation.sections.verticalNavigation.notifications'),
        icon: 'images/svg/notification-icons/notification-gray.svg',
        route: 'test',
        exact: true
    },
    {
        label: translate.instant('storybook.navigation.sections.verticalNavigation.settings'),
        icon: 'images/svg/notification-icons/setting-gray.svg',
        route: 'reports',
        exact: true
    },
    {
        label: translate.instant('storybook.navigation.sections.verticalNavigation.disabled'),
        icon: 'images/svg/notification-icons/menu-bar.svg',
        route: '/disabled',
        disabled: true,
        exact: true
    }
];

export const HORIZONTALNAVBARS = (translate: TranslateService): NavigationItem[] => [
    { label: translate.instant('storybook.navigation.sections.horizontalNavigation.dashboard'), route: '/storybook/navigation', exact: true },
    { label: translate.instant('storybook.navigation.sections.horizontalNavigation.projects'), route: 'test', exact: true },
    { label: translate.instant('storybook.navigation.sections.horizontalNavigation.team'), route: 'reports', exact: true },
    { label: translate.instant('storybook.navigation.sections.horizontalNavigation.calendar'), route: 'test', exact: true },
    { label: translate.instant('storybook.navigation.sections.horizontalNavigation.disabled'), route: 'report', disabled: true, exact: true }
];

export const PILLARRAY = (translate: TranslateService): PillItem[] => [
    { id: 'all', label: translate.instant('storybook.navigation.sections.pillsNavigation.all') },
    { id: 'active', label: translate.instant('storybook.navigation.sections.pillsNavigation.active') },
    { id: 'completed', label: translate.instant('storybook.navigation.sections.pillsNavigation.completed') },
    { id: 'archived', label: translate.instant('storybook.navigation.sections.pillsNavigation.archived') }
];

export const ITEMS: Item[] = [
  { id: 1, status: 'active', name: 'Task 1' },
  { id: 2, status: 'completed', name: 'Task 2' },
  { id: 3, status: 'archived', name: 'Task 3' },
  { id: 4, status: 'active', name: 'Task 4' },
  { id: 5, status: 'completed', name: 'Task 5' }
] as const;




