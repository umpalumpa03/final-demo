import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { filter, map, of, switchMap, take } from 'rxjs';
import { Routes } from '../models/tokens.model';
import { TokenService } from '../services/token.service';
import { Store } from '@ngrx/store';
import { UserInfoActions } from '../../../store/user-info/user-info.actions';
import {
  selectUserInfoState,
} from '../../../store/user-info/user-info.selectors';

export const AuthGuard: CanActivateChildFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const store = inject(Store);

  if (!tokenService.accessToken && !tokenService.refreshToken) {
    return of(router.createUrlTree([Routes.SIGN_IN]));
  }

  return store.select(selectUserInfoState).pipe(
    take(1),
    switchMap((state) => {
      if (state.loaded && !state.error) {
        return of(true);
      }

      if (!state.loading) {
        store.dispatch(UserInfoActions.loadUser());
      }

      return store.select(selectUserInfoState).pipe(
        filter((state) => state.loaded || !!state.error),
        map((state) => {
          if (state.error || !state.fullName) {
            return router.createUrlTree([Routes.SIGN_IN]);
          }
          return true;
        }),
        take(1),
      );
    }),
  );
};
 
 