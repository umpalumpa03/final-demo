import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { paybillReducer } from './store/paybill.reducer';
import { PaybillEffect } from './store/paybill.effects';

export const PAYBILL_ROUTES: Routes = [
  {
    path: '',

    loadComponent: () =>
      import('./container/paybill-container').then((c) => c.PaybillContainer),
    providers: [
      provideState({ name: 'paybill', reducer: paybillReducer }),
      provideEffects(PaybillEffect),
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
          import(
            './components/paybill-templates/container/paybill-templates-container'
          ).then((c) => c.PaybillTemplatesContainer),
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
