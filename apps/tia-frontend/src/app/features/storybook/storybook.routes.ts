import { Routes } from '@angular/router';
// import { supportRoleGuard } from '../../core/guards/support-role.guard';

export const storybookRoutes: Routes = [
  {
    path: 'storybook',
    loadComponent: () =>
      import('./container/storybook.container').then((c) => c.LibraryContainer),
    // canActivate: [supportRoleGuard],

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
        path: 'navigation',
        loadChildren: () =>
          import('./components/navigation/navigation-tabs.routes').then(
            (c) => c.navRoutes,
          ),
      },
      {
        path: 'draganddrop',
        loadComponent: () =>
          import('./components/drag-and-drop/container/drag-and-drop').then(
            (c) => c.DragAndDropContainer,
          ),
      },
      {
        path: 'buttons',
        loadComponent: () =>
          import('./components/button/button-library').then(
            (c) => c.ButtonLibraryComponent,
          ),
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./components/cards/cards').then((c) => c.Cards),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./components/alerts/container/alerts').then((c) => c.Alerts),
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
        path: 'datadisplay',
        loadComponent: () =>
          import('./components/data-display/data-display').then(
            (c) => c.DataDisplay,
          ),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./components/feedback/feedback').then((c) => c.Feedback),
      },
      {
        path: 'tables',
        loadComponent: () =>
          import('./components/tables/container/tables-container').then(
            (c) => c.TablesContainer,
          ),
      },
      {
        path: 'inputs',
        loadComponent: () =>
          import('./components/input/input').then((c) => c.Input),
      },
      {
        path: 'layout',
        loadComponent: () =>
          import('./components/layout/container/layout').then((c) => c.Layout),
      },
    ],
  },
];
