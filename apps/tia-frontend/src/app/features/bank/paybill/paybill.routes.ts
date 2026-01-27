import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { paybillReducer } from './store/paybill.reducer';
import * as paybillEffects from './store/paybill.effects';

export const PAYBILL_ROUTES: Routes = [
  {
    path: '',

    loadComponent: () =>
      import('./container/paybill-container').then((c) => c.PaybillContainer),
    providers: [
      provideState({ name: 'paybill', reducer: paybillReducer }),
      provideEffects(paybillEffects),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/paybill-main/paybill-main').then(
            (c) => c.PaybillMain,
          ),
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./components/paybill-templates/paybill-templates').then(
            (c) => c.PaybillTemplates,
          ),
      },
      {
        path: ':categoryId',
        loadComponent: () =>
          import('./components/paybill-main/paybill-main').then(
            (c) => c.PaybillMain,
          ),
      },
      {
        path: ':categoryId/:providerId',
        loadComponent: () =>
          import('./components/paybill-main/paybill-main').then(
            (c) => c.PaybillMain,
          ),
      },
    ],
  },
];
