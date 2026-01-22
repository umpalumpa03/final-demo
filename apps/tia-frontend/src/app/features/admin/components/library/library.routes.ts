import { Routes } from '@angular/router';

export const libraryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/library-container').then((c) => c.LibraryContainer),
    children: [
      {
        path: '',
        redirectTo: 'colorpalettes',
        pathMatch: 'full',
      },
      {
        path: 'colorpalettes',
        loadComponent: () =>
          import('./components/colorpalettes/colorpalettes').then(
            (c) => c.Colorpalettes,
          ),
      },
      {
        path: 'draganddrop',
        loadComponent: () =>
          import('./components/drag-and-drop/container/drag-and-drop').then(
            (c) => c.DragAndDropContainer,
          ),
      },
      // {
      //   path: 'buttons',
      //   loadComponent: () =>
      //     import('./components/button/button-library').then(
      //       (c) => c.ButtonLibrary,
      //     ),
      // },
      {
        path: 'cards',
        loadComponent: () =>
          import('./components/cards/cards').then((c) => c.Cards),
      },
      {
        path: 'badges',
        loadComponent: () =>
          import('./components/badges/badge-component').then(
            (c) => c.BadgeComponent,
          ),
      },
      {
        path: 'forms',
        loadComponent: () =>
          import('./components/forms/forms').then((c) => c.Forms),
      },
      {
        path: 'overlay',
        loadComponent: () =>
          import('./components/overlay/overlay').then((c) => c.Overlay),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./components/feedback/feedback').then((c) => c.Feedback),
      },
      {
        path: '**',
        redirectTo: 'colorpalettes',
      },
    ],
  },
];
