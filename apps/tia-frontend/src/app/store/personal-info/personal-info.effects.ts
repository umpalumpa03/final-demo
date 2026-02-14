import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { PersonalInfoApiService } from '../../shared/services/personal-info/personal-info.api.service';
import { PersonalInfoActions } from './pesronal-info.actions';
import { catchError, exhaustMap, map, of, switchMap, withLatestFrom } from 'rxjs';
import { UpdatePersonalInfoDto } from './personal-info.state';
import { Store } from '@ngrx/store';
import { selectPersonalInfo } from './personal-info.selectors';
import { UserInfoActions } from '../user-info/user-info.actions';

@Injectable()
export class PersonalInfoEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(PersonalInfoApiService);
  private readonly store = inject(Store);

  resetPersonalInfoOnUserChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserInfoActions.loadUser),
      map(() => PersonalInfoActions.resetPersonalInfo()),
    ),
  );

  loadPersonalInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonalInfoActions.loadPersonalInfo),
      withLatestFrom(this.store.select(selectPersonalInfo)),
      exhaustMap(([{ forceRefresh }, personalInfo]) => {
       
        const hasPId = !!personalInfo?.pId;
        const hasPhoneNumber = !!(personalInfo?.phoneNumber && personalInfo.phoneNumber.trim() !== '');
        const hasValidData = hasPId || hasPhoneNumber;
        
    
        if (hasValidData && !forceRefresh) {
          return of(
            PersonalInfoActions.loadPersonalInfoSuccess({
              personalInfo: {
                pId: personalInfo?.pId ?? null,
                phoneNumber: personalInfo?.phoneNumber ?? null,
                loading: false,
                error: null,
                phoneUpdateChallengeId: personalInfo?.phoneUpdateChallengeId ?? null,
                phoneUpdateLoading: personalInfo?.phoneUpdateLoading ?? false,
                phoneUpdateError: personalInfo?.phoneUpdateError ?? null,
                phoneUpdatePendingPhone: personalInfo?.phoneUpdatePendingPhone ?? null,
                phoneUpdateResendCount: personalInfo?.phoneUpdateResendCount ?? 0,
              },
            }),
          );
        }

      
        return this.api.getPersonalInfo().pipe(
          map((dto) =>
            PersonalInfoActions.loadPersonalInfoSuccess({
              personalInfo: {
                pId: dto.pId,
                phoneNumber: dto.phone,
                loading: false,
                error: null,
                phoneUpdateChallengeId: personalInfo?.phoneUpdateChallengeId ?? null,
                phoneUpdateLoading: personalInfo?.phoneUpdateLoading ?? false,
                phoneUpdateError: personalInfo?.phoneUpdateError ?? null,
                phoneUpdatePendingPhone: personalInfo?.phoneUpdatePendingPhone ?? null,
                phoneUpdateResendCount: personalInfo?.phoneUpdateResendCount ?? 0,
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
        );
      }),
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

  initiatePhoneUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonalInfoActions.initiatePhoneUpdate),
      switchMap(({ phone }) =>
        this.api.initiatePhoneUpdate(phone).pipe(
          map((response) =>
            PersonalInfoActions.initiatePhoneUpdateSuccess({
              challengeId: response.challengeId,
              method: response.method,
            }),
          ),
          catchError((error: HttpErrorResponse | Error) => {
            let errorMessage = 'Failed to initiate phone update';
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
              PersonalInfoActions.initiatePhoneUpdateFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    ),
  );

  verifyPhoneUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonalInfoActions.verifyPhoneUpdate),
      switchMap(({ challengeId, code }) =>
        this.api.verifyPhoneUpdate(challengeId, code).pipe(
          map((response) =>
            PersonalInfoActions.verifyPhoneUpdateSuccess({
              message: response.message,
            }),
          ),
          catchError((error: HttpErrorResponse | Error) => {
            let errorMessage = 'Failed to verify phone update';
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
              PersonalInfoActions.verifyPhoneUpdateFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    ),
  );

  resendPhoneOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PersonalInfoActions.resendPhoneOTP),
      switchMap(({ challengeId }) =>
        this.api.resendPhoneOtp(challengeId).pipe(
          map(() => PersonalInfoActions.resendPhoneOTPSuccess()),
          catchError((error: HttpErrorResponse | Error) => {
            let errorMessage = 'Failed to resend OTP';
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
              PersonalInfoActions.resendPhoneOTPFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    ),
  );
}