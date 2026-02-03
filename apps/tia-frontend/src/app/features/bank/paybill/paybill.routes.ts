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
      { path: '', redirectTo: 'pay', pathMatch: 'full' },
      {
        path: 'pay',
        loadComponent: () =>
          import('./components/paybill-main/container/paybill-main').then(
            (c) => c.PaybillMain,
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './components/paybill-main/components/category-grid/container/category-grid-container'
              ).then((c) => c.CategoryGridContainer),
          },
          {
            path: 'payment-success',
            loadComponent: () =>
              import(
                './components/paybill-main/components/paybill-success/container/paybill-success-container'
              ).then((c) => c.PaybillSuccessContainer),
          },
          {
            path: 'otp-verification',
            loadComponent: () =>
              import(
                './components/paybill-main/components/paybill-otp-verification/container/paybill-otp-verification-container'
              ).then((c) => c.PaybillOtpVerificationContainer),
          },
          {
            path: 'confirm-payment',
            loadComponent: () =>
              import(
                './components/paybill-main/components/paybill-confirm-payment/container/paybill-confirm-payment-container'
              ).then((c) => c.PaybillConfirmPaymentContainer),
          },
          {
            path: ':categoryId',
            children: [
              {
                path: '**',
                loadComponent: () =>
                  import(
                    './components/paybill-main/components/provider-list/container/provider-list-container'
                  ).then((c) => c.ProviderListContainer),
                children: [
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './components/paybill-main/components/paybill-form/container/paybill-form-container'
                      ).then((c) => c.PaybillFormContainer),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'templates',
        loadComponent: () =>
          import(
            './components/paybill-templates/container/paybill-templates-container'
          ).then((c) => c.PaybillTemplatesContainer),
      },
    ],
  },
];
