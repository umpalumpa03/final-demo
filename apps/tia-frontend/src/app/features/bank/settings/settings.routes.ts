import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './components/appearance/guard/unsaved-changes.guard';
import { supportRoleGuard } from '@tia/core/guards/support-role.guard';
import { AccountPermissionsStore } from './components/approve-accounts/store/approve-accounts.store';

export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/settings-container').then((c) => c.SettingsContainer),
    providers: [AccountPermissionsStore],
    children: [
      {
        path: '',
        redirectTo: 'appearance',
        pathMatch: 'full',
      },
      {
        path: 'appearance',
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./components/appearance/container/appearance-container').then(
            (c) => c.AppearanceContainer,
          ),
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
        canActivate: [supportRoleGuard],
        loadChildren: () =>
          import('./components/user-management/user-management.routes').then(
            (m) => m.userManagementRoutes,
          ),
      },
      {
        path: 'approve-accounts',
        canActivate: [supportRoleGuard],
        loadComponent: () =>
          import(
            './components/approve-accounts/container/approve-accounts-container'
          ).then((c) => c.ApproveAccountsContainer),
      },
      {
        path: 'approve-cards',
        canActivate: [supportRoleGuard],
        loadComponent: () =>
          import(
            './components/approve-cards/container/approve-cards-container'
          ).then((c) => c.ApproveCardsContainer),
      },
      {
        path: 'loan-management',
        canActivate: [supportRoleGuard],
        loadComponent: () =>
          import(
            './components/loan-management/container/loan-management-container'
          ).then((c) => c.LoanManagementContainer),
      },
    ],
  },
];
