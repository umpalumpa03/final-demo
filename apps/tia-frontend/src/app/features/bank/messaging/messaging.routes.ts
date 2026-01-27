import { Route } from "@angular/router";


export const messagingRoutes: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./container/messaging-container').then((c) => c.MessagingContainer),

        children: [
            {
                path: 'inbox',
                loadComponent: () =>
                    import('./components/inbox/inbox').then((c) => c.Inbox),
            },
            {
                path: 'sent',
                loadComponent: () =>
                    import('./components/sent/sent').then((c) => c.Sent),
            },
            {
                path: 'draft',
                loadComponent: () =>
                    import('./components/draft/draft').then((c) => c.Draft),
            }
            ,
            {
                path: 'important',
                loadComponent: () =>
                    import('./components/important/important').then((c) => c.Important),
            }
            ,
            {
                path: 'favorites',
                loadComponent: () =>
                    import('./components/favorites/favorites').then((c) => c.Favorites),
            }
        ]
    }
]