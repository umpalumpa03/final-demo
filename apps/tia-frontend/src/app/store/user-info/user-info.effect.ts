import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserInfoService } from '@tia/shared/services/user-info/user-info.service';
import { UserInfoActions } from './user-info.actions';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserInfoEffects {
  private actions$ = inject(Actions);
  private userInfoService = inject(UserInfoService);

  public loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserInfoActions.loadUser),
      switchMap(() =>
        this.userInfoService.getUserInfo().pipe(
          tap((user) => {

            if (user.theme) {
              localStorage.setItem('theme', user.theme);
            }
            if (user.language) {
              if (user.language === 'georgian') {
                localStorage.setItem('language', 'ka');
              } else {
                localStorage.setItem('language', 'en');
              }
            }
          }),
          map((user) => UserInfoActions.loadUserSuccess({ user })),
          catchError((error) =>
            of(
              UserInfoActions.loadUserError({
                error: error.message || 'error',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
