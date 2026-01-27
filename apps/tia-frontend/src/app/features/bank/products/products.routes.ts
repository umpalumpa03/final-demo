import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { productsReducer } from '../../../store/products/products.reducer';
import { ProductsEffects } from '../../../store/products/products.effects';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/products-container').then((c) => c.ProductsContainer),
    children: [
      {
        path: '',
        redirectTo: 'accounts',
        pathMatch: 'full',
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./components/accounts/accounts').then((c) => c.Accounts),
        providers: [
          provideState({ name: 'products', reducer: productsReducer }),
          provideEffects(ProductsEffects),
        ],
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./components/cards/cards').then((c) => c.Cards),
      },
    ],
  },
];
