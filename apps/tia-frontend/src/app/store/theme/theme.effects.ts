import { DOCUMENT, inject, Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ThemeActions } from './theme.actions';
import { tap, withLatestFrom } from 'rxjs';
import { selectActiveTheme } from './theme.selectors';

@Injectable()
export class ThemeEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
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

          const themeName = this.toCamelCase(theme);
          this.document.documentElement.setAttribute('data-theme', themeName);
          localStorage.setItem('theme', theme);
        }),
      ),
    { dispatch: false },
  );
  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }
}
