import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Routes } from '../models/tokens.model';
import { TokenService } from '../services/token.service';
import { filter, map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserInfoActions } from '../../../store/user-info/user-info.actions';
import {
  selectUserInfoState,
} from '../../../store/user-info/user-info.selectors';

export const GuestGuard: CanActivateChildFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const store = inject(Store);

  if (!tokenService.accessToken && !tokenService.refreshToken) {
    return of(true);
  }

  return store.select(selectUserInfoState).pipe(
    take(1),
    switchMap((state) => {
      if (state.loaded && !state.error) {
        if (!state.fullName) {
          return of(true);
        }
        return of(router.createUrlTree([Routes.DASHBOARD]));
      }

      if (!state.loading) {
        store.dispatch(UserInfoActions.loadUser());
      }

      return store.select(selectUserInfoState).pipe(
        filter((s) => s.loaded || !!s.error),
        map((s) => {
          if (s.error || !s.fullName) {
            return true;
          }
          return router.createUrlTree([Routes.DASHBOARD]);
        }),
        take(1),
      );
    }),
  );
};
