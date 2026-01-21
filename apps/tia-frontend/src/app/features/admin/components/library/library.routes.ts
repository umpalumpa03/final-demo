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
          import('./components/drag-and-drop/drag-and-drop').then(
            (c) => c.DragAndDropContainer,
          ),
      },
      {
        path: '**',
        redirectTo: 'colorpalettes',
      },
    ],
  },
];
