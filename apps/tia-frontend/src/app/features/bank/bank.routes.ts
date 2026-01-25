import { Routes } from '@angular/router';

export const bankRoutes: Routes = [
  {
    path: 'bank',
    loadComponent: () =>
      import('./container/bank-container').then((c) => c.BankContainer),
  },
];
