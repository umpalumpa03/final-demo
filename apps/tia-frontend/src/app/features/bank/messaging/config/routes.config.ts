import { NavigationItem } from "@tia/shared/lib/navigation/models/nav-bar.model";

export const MESSAGINGROUTES: NavigationItem[] = [
    {
        label: 'Inbox',
        icon: 'images/svg/messaging/inbox.svg',
        route: 'inbox',
        count: 0
    },
    {
        label: 'Sent',
        icon: 'images/svg/messaging/sent.svg',
        route: 'sent',
        count: 0
    },
    {
        label: 'Drafts',
        icon: 'images/svg/messaging/drafts.svg',
        route: 'draft',
        count: 0
    },
    {
        label: 'Important',
        icon: 'images/svg/messaging/important.svg',
        route: 'important',
        count: 0
    },
    {
        label: 'Favorites',
        icon: 'images/svg/messaging/favorites.svg',
        route: 'favorites',
        count: 0
    }
] as const;