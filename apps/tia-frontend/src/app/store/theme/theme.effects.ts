import { DOCUMENT, inject, Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { ThemeActions } from './theme.actions';
import { tap } from 'rxjs';
import { toCamelCase } from '@tia/shared/utils/camel-case/camel-case.utils';

@Injectable()
export class ThemeEffects {
  private actions$ = inject(Actions);
  private document = inject(DOCUMENT);

  public syncTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeActions.setTheme, ROOT_EFFECTS_INIT),
        tap((action) => {
          const theme =
            action.type === ThemeActions.setTheme.type
              ? action.theme
              : localStorage.getItem('theme') || 'ocean-blue';

          const themeName = toCamelCase(theme);
          this.document.documentElement.setAttribute('data-theme', themeName);
          localStorage.setItem('theme', theme);
        }),
      ),
    { dispatch: false },
  );
}
