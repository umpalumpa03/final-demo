import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { userInfoFeature } from '../../store/user-info/user-info.reducer';

export const supportRoleGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(userInfoFeature.selectRole).pipe(
    map((role) => {
      if (role === 'SUPPORT') {
        return true;
      }
      return router.createUrlTree(['/bank/dashboard']);
    }),
  );
};
