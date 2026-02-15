import { Routes } from '@angular/router';
import { UserManagementState } from './shared/state/user-management.state';
import { UserModalService } from './shared/services/user-modal.service';

export const userManagementRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./container/user-management-container').then(
        (c) => c.UserManagementContainer,
      ),
    providers: [UserManagementState, UserModalService],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/user-management/user-management.component').then(
            (c) => c.UserManagementComponent,
          ),
      },
    ],
  },
];
