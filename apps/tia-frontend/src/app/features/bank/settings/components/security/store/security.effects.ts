import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SecurityService } from '../service/security.service';
import { SecurityActions } from './security.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class SecurityEffects {
  private actions$ = inject(Actions);
  private securityService = inject(SecurityService);

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SecurityActions.changePassword),
      switchMap(({ currentPassword, newPassword }) =>
        this.securityService.changePassword(currentPassword, newPassword).pipe(
          map(() => SecurityActions.changePasswordSuccess()),
          catchError((error) =>
            of(SecurityActions.changePasswordFailure({
                error: error?.error?.message ?? 'Password change failed',
              })),
          ),
        ),
      ),
    ),
  );
}
