import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PersonalInfoApiService } from '../../shared/services/personal-info/personal-info.api.service';
import { PersonalInfoActions } from './pesronal-info.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PersonalInfoDto, UpdatePersonalInfoDto } from './personal-info.state';

@Injectable()
export class PersonalInfoEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(PersonalInfoApiService);

  loadPersonalInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonalInfoActions.loadPersonalInfo),
      mergeMap(() =>
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
      mergeMap(({ personalInfo }) => {
    
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
          catchError((error) =>
            of(
              PersonalInfoActions.updatePersonalInfoFailure({
                error: error.message ?? 'Update personal info error',
              }),
            ),
          ),
        );
      }),
    ),
  );
}