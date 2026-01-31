import { Routes } from '@angular/router';
import { appearanceUnsavedGuard } from './components/appearance/guard/appearance-unsaved.guard';

export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/settings-container').then(
        (c) => c.SettingsContainer,
      ),
    children: [
      {
        path: '',
        redirectTo: 'appearance',
        pathMatch: 'full',
      },
      {
        path: 'appearance',
        canDeactivate: [appearanceUnsavedGuard],
        loadComponent: () =>
          import(
            './components/appearance/container/appearance-container'
          ).then((c) => c.AppearanceContainer),
      },
      {
        path: 'language',
        loadComponent: () =>
          import('./components/language/container/language-container').then(
            (c) => c.LanguageContainer,
          ),
      },
      {
        path: 'profile-photo',
        loadComponent: () =>
          import(
            './components/profile-photo/container/profile-photo-container'
          ).then((c) => c.ProfilePhotoContainer),
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./components/accounts/container/accounts-container').then(
            (c) => c.AccountsContainer,
          ),
      },
  
      {
        path: 'security',
        loadComponent: () =>
          import('./components/security/container/security-container').then(
            (c) => c.SecurityContainer,
          ),
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import(
            './components/user-management/container/user-management-container'
          ).then((c) => c.UserManagementContainer),
      },
      {
        path: 'approve-accounts',
        loadComponent: () =>
          import(
            './components/approve-accounts/container/approve-accounts-container'
          ).then((c) => c.ApproveAccountsContainer),
      },
      {
        path: 'approve-cards',
        loadComponent: () =>
          import(
            './components/approve-cards/container/approve-cards-container'
          ).then((c) => c.ApproveCardsContainer),
      },
      {
        path: 'loan-management',
        loadComponent: () =>
          import(
            './components/loan-management/container/loan-management-container'
          ).then((c) => c.LoanManagementContainer),
      },
 
    ],
  },
];
