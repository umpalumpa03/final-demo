import { Route } from "@angular/router";
import { MessagingStore } from "./store/messaging.store";


export const messagingRoutes: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./container/messaging-container').then((c) => c.MessagingContainer),
        providers: [MessagingStore],

        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'inbox',
            },
            {
                path: 'inbox/:id',
                loadComponent: () =>
                    import('./components/inbox-detail/inbox-detail').then((c) => c.InboxDetail),
            },
            {
                path: 'important/:id',
                loadComponent: () =>
                    import('./components/inbox-detail/inbox-detail').then((c) => c.InboxDetail),
            },
            {
                path: 'favorites/:id',
                loadComponent: () =>
                    import('./components/inbox-detail/inbox-detail').then((c) => c.InboxDetail),
            },
            {
                path: 'sent/:id',
                loadComponent: () =>
                    import('./components/sent-draft-detail/sent-draft-detail').then((c) => c.SentDraftDetail),
            },
            {
                path: 'draft/:id',
                loadComponent: () =>
                    import('./components/sent-draft-detail/sent-draft-detail').then((c) => c.SentDraftDetail),
            },
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