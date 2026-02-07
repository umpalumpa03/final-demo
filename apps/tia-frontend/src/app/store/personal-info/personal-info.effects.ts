import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { PersonalInfoApiService } from '../../shared/services/personal-info/personal-info.api.service';
import { PersonalInfoActions } from './pesronal-info.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { UpdatePersonalInfoDto } from './personal-info.state';

@Injectable()
export class PersonalInfoEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(PersonalInfoApiService);

  loadPersonalInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonalInfoActions.loadPersonalInfo),
      switchMap(() =>
        this.api.getPersonalInfo().pipe(
          map((dto) =>
            PersonalInfoActions.loadPersonalInfoSuccess({
              personalInfo: {
                pId: dto.pId,
                phoneNumber: dto.phone,
                loading: false,
                error: null,
              },
            }),
          ),
          catchError((error) =>
            of(
              PersonalInfoActions.loadPersonalInfoFailure({
                error: error.message ?? 'Load personal info error',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updatePersonalInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonalInfoActions.updatePersonalInfo),
      switchMap(({ personalInfo }) => {
    
        const dto: UpdatePersonalInfoDto = {
          pId: personalInfo.pId,
        };
        return this.api.updatePersonalInfo(dto).pipe(
          map(() =>
            PersonalInfoActions.updatePersonalInfoSuccess({
             
              personalInfo: {
                ...personalInfo,
                loading: false,
                error: null,
              },
            }),
          ),
          catchError((error: HttpErrorResponse | Error) => {
            let errorMessage = 'Update personal info error';
            
            if (error instanceof HttpErrorResponse) {
          
              if (typeof error.error === 'string') {
                errorMessage = error.error;
              } else if (error.error?.message) {
                if (Array.isArray(error.error.message)) {
                  errorMessage = error.error.message[0];
                } else {
                  errorMessage = error.error.message;
                }
              } else if (error.message) {
                errorMessage = error.message;
              }
            } else if (error instanceof Error) {
              errorMessage = error.message;
            }
            
            return of(
              PersonalInfoActions.updatePersonalInfoFailure({
                error: errorMessage,
              }),
            );
          }),
        );
      }),
    ),
  );
}