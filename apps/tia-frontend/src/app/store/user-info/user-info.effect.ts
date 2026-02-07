import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserInfoService } from '@tia/shared/services/user-info/user-info.service';
import { UserInfoActions } from './user-info.actions';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { WidgetsService } from '../../features/bank/dashboard/services/widgets-service';

@Injectable()
export class UserInfoEffects {
  private actions$ = inject(Actions);
  private userInfoService = inject(UserInfoService);
  private widgetService = inject(WidgetsService);
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

  public loadWidgets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserInfoActions.loadWidgets, UserInfoActions.loadUserSuccess),
      switchMap(() =>
        this.widgetService.getWidgets().pipe(
          map((widgets) => UserInfoActions.loadWidgetsSuccess({ widgets })),
          catchError((error) =>
            of(UserInfoActions.loadWidgetsError({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  public toggleWidget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserInfoActions.updateWidgetState),
      switchMap(({ id, isSelected }) => {
        return this.widgetService
          .updateWidget(id, { isHidden: !isSelected })
          .pipe(
            map((widget) =>
              UserInfoActions.updateWidgetStateSuccess({ widget }),
            ),
          );
      }),
    ),
  );
}
