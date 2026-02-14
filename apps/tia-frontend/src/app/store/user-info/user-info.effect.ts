import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserInfoService } from '@tia/shared/services/user-info/user-info.service';
import { UserInfoActions } from './user-info.actions';
import {
  switchMap,
  map,
  tap,
  catchError,
  withLatestFrom,
  filter,
  mergeMap,
  debounceTime,
} from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { WidgetsApiService } from '../../shared/services/user-info/widgets-service.api';
import { Store } from '@ngrx/store';
import { selectWidgetsLoaded } from './user-info.selectors';

@Injectable()
export class UserInfoEffects {
  private readonly actions$ = inject(Actions);
  private readonly userInfoService = inject(UserInfoService);
  private readonly widgetService = inject(WidgetsApiService);
  private readonly store = inject(Store);

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
              const languageCode = user.language === 'georgian' ? 'ka' : 'en';
              if (user.language === 'georgian') {
                localStorage.setItem('language', 'ka');
              } else {
                localStorage.setItem('language', 'en');
              }
              this.store.dispatch(
                UserInfoActions.loadUserLanguage({ language: languageCode }),
              );
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

  public createWidget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserInfoActions.createWidget),
      mergeMap(({ widget }) =>
        this.widgetService.createWidget(widget).pipe(
          map(() => UserInfoActions.loadWidgets({ force: true })),
          catchError((error) =>
            of(UserInfoActions.createWidgetError({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  public updateWidgetsBulk$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserInfoActions.updateWidgetsBulk),
      switchMap(({ updates }) => {
        const requests = updates.map((u) =>
          this.widgetService.updateWidget(u.id, u.updates),
        );
        return forkJoin(requests).pipe(
          map((widgets) =>
            UserInfoActions.updateWidgetsBulkSuccess({ widgets }),
          ),
          catchError((error) =>
            of(
              UserInfoActions.updateWidgetsBulkError({ error: error.message }),
            ),
          ),
        );
      }),
    ),
  );

  public loadWidgets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserInfoActions.loadWidgets),
      withLatestFrom(this.store.select(selectWidgetsLoaded)),
      filter(([action, loaded]) => action.force || !loaded),
      debounceTime(100),
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

  public deleteWidget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserInfoActions.deleteWidget),
      mergeMap(({ id }) =>
        this.widgetService.deleteWidget(id).pipe(
          map(() => UserInfoActions.deleteWidgetSuccess({ id })),
          catchError((error) =>
            of(UserInfoActions.deleteWidgetError({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  public updateOnboarding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserInfoActions.updateOnboardingStatus),
      switchMap(({ completed }) =>
        this.userInfoService.updateOnboardingStatus(completed).pipe(
          map(() =>
            UserInfoActions.updateOnboardingStatusSuccess({ completed }),
          ),
          catchError((error) =>
            of(
              UserInfoActions.updateOnboardingStatusError({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
