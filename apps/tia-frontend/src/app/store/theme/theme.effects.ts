import { DOCUMENT, inject, Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { ThemeActions } from './theme.actions';
import { tap } from 'rxjs';
import { UserInfoActions } from '../user-info/user-info.actions';

@Injectable()
export class ThemeEffects {
  private actions$ = inject(Actions);
  private document = inject(DOCUMENT);

  public syncTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ThemeActions.setTheme,
          UserInfoActions.loadUserSuccess,
          ROOT_EFFECTS_INIT,
        ),
        tap((action) => {
          let theme: string;

          if (action.type === ThemeActions.setTheme.type) {
            theme = action.theme;
          } else if (action.type === UserInfoActions.loadUserSuccess.type) {
            theme =
              action.user.theme || localStorage.getItem('theme') || 'oceanBlue';
          } else {
            theme = localStorage.getItem('theme') || 'oceanBlue';
          }

          this.document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('theme', theme);
        }),
      ),
    { dispatch: false },
  );
}
