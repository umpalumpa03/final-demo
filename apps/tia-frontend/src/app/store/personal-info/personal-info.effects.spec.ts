import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { Action } from '@ngrx/store';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { PersonalInfoEffects } from './personal-info.effects';
import { PersonalInfoApiService } from '../../shared/services/personal-info/personal-info.api.service';
import { PersonalInfoActions } from './pesronal-info.actions';
import { PersonalInfoDto, personalInfoState } from './personal-info.state';
import { HttpErrorResponse } from '@angular/common/http';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectPersonalInfo } from './personal-info.selectors';
import { UserInfoActions } from '../user-info/user-info.actions';

describe('PersonalInfoEffects (Vitest)', () => {
  let actions$: Observable<Action>;
  let effects: PersonalInfoEffects;
  let store: MockStore;
  let apiService: {
    getPersonalInfo: ReturnType<typeof vi.fn>;
    updatePersonalInfo: ReturnType<typeof vi.fn>;
    initiatePhoneUpdate: ReturnType<typeof vi.fn>;
    verifyPhoneUpdate: ReturnType<typeof vi.fn>;
    resendPhoneOtp: ReturnType<typeof vi.fn>;
  };

  const mockDto: PersonalInfoDto = {
    pId: '12345678901',
    phone: '555999333',
  };

  const basePersonalInfoPayload: personalInfoState = {
    pId: '12345678901',
    phoneNumber: '555999333',
    loading: false,
    error: null,
    phoneUpdateChallengeId: null,
    phoneUpdateLoading: false,
    phoneUpdateError: null,
    phoneUpdatePendingPhone: null,
    phoneUpdateResendCount: 0,
  };

  beforeEach(() => {
    apiService = {
      getPersonalInfo: vi.fn(),
      updatePersonalInfo: vi.fn(),
      initiatePhoneUpdate: vi.fn(),
      verifyPhoneUpdate: vi.fn(),
      resendPhoneOtp: vi.fn(),
    };

    actions$ = of(PersonalInfoActions.loadPersonalInfo({}));

    TestBed.configureTestingModule({
      providers: [
        PersonalInfoEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { 
              selector: selectPersonalInfo, 
              value: { 
                pId: null, 
                phoneNumber: null, 
                loading: false, 
                error: null,
                phoneUpdateChallengeId: null,
                phoneUpdateLoading: false,
                phoneUpdateError: null,
                phoneUpdatePendingPhone: null,
                phoneUpdateResendCount: 0,
              } 
            },
          ],
        }),
        { provide: PersonalInfoApiService, useValue: apiService },
      ],
    });

    effects = TestBed.inject(PersonalInfoEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch loadPersonalInfoSuccess with mapped state', async () => {
    (apiService.getPersonalInfo as any).mockReturnValue(of(mockDto));

    const action = await firstValueFrom(effects.loadPersonalInfo$);

    expect(action).toEqual(
      PersonalInfoActions.loadPersonalInfoSuccess({
        personalInfo: {
          pId: mockDto.pId,
          phoneNumber: mockDto.phone,
          loading: false,
          error: null,
          phoneUpdateChallengeId: null,
          phoneUpdateLoading: false,
          phoneUpdateError: null,
          phoneUpdatePendingPhone: null,
          phoneUpdateResendCount: 0,
        },
      }),
    );

    expect(apiService.getPersonalInfo).toHaveBeenCalledTimes(1);
  });

 

  it('should dispatch updatePersonalInfoSuccess when update succeeds', async () => {
    (apiService.updatePersonalInfo as any).mockReturnValue(
      of({ message: 'pId updated' }),
    );

    actions$ = of(
      PersonalInfoActions.updatePersonalInfo({ personalInfo: basePersonalInfoPayload }),
    );

    const action = await firstValueFrom(effects.updatePersonalInfo$);

    expect(action).toEqual(
      PersonalInfoActions.updatePersonalInfoSuccess({
        personalInfo: {
          ...basePersonalInfoPayload,
          loading: false,
          error: null,
        },
      }),
    );

    expect(apiService.updatePersonalInfo).toHaveBeenCalledWith({
      pId: basePersonalInfoPayload.pId,
    });
  });

  it('should dispatch updatePersonalInfoFailure when update throws', async () => {
    (apiService.updatePersonalInfo as any).mockReturnValue(
      throwError(() => new Error('Update failed')),
    );

    actions$ = of(
      PersonalInfoActions.updatePersonalInfo({ personalInfo: basePersonalInfoPayload }),
    );

    const action = await firstValueFrom(effects.updatePersonalInfo$);

    expect(action).toEqual(
      PersonalInfoActions.updatePersonalInfoFailure({
        error: 'Update failed',
      }),
    );
  });

  it('should dispatch loadPersonalInfoFailure when getPersonalInfo fails', async () => {
    (apiService.getPersonalInfo as any).mockReturnValue(throwError(() => new Error('Load failed')));
    actions$ = of(PersonalInfoActions.loadPersonalInfo({}));
    const action = await firstValueFrom(effects.loadPersonalInfo$);
    expect(action).toEqual(PersonalInfoActions.loadPersonalInfoFailure({ error: 'Load failed' }));
  });

  it('should handle HttpErrorResponse with array message', async () => {
    (apiService.updatePersonalInfo as any).mockReturnValue(
      throwError(() => new HttpErrorResponse({ error: { message: ['First error'] }, status: 400 })),
    );
    actions$ = of(PersonalInfoActions.updatePersonalInfo({ personalInfo: basePersonalInfoPayload }));
    const action = await firstValueFrom(effects.updatePersonalInfo$);
    expect(action).toEqual(PersonalInfoActions.updatePersonalInfoFailure({ error: 'First error' }));
  });

  it('should use cached data when personal info already exists', async () => {
    const cachedPersonalInfo: personalInfoState = {
      pId: '12345678901',
      phoneNumber: '555999333',
      loading: false,
      error: null,
      phoneUpdateChallengeId: null,
      phoneUpdateLoading: false,
      phoneUpdateError: null,
      phoneUpdatePendingPhone: null,
      phoneUpdateResendCount: 0,
    };

    store.overrideSelector(selectPersonalInfo, cachedPersonalInfo);
    store.refreshState();

    actions$ = of(PersonalInfoActions.loadPersonalInfo({}));
    const action = await firstValueFrom(effects.loadPersonalInfo$);

    expect(action).toEqual(
      PersonalInfoActions.loadPersonalInfoSuccess({
        personalInfo: {
          pId: cachedPersonalInfo.pId,
          phoneNumber: cachedPersonalInfo.phoneNumber,
          loading: false,
          error: null,
          phoneUpdateChallengeId: cachedPersonalInfo.phoneUpdateChallengeId,
          phoneUpdateLoading: cachedPersonalInfo.phoneUpdateLoading,
          phoneUpdateError: cachedPersonalInfo.phoneUpdateError,
          phoneUpdatePendingPhone: cachedPersonalInfo.phoneUpdatePendingPhone,
          phoneUpdateResendCount: cachedPersonalInfo.phoneUpdateResendCount,
        },
      }),
    );

    expect(apiService.getPersonalInfo).not.toHaveBeenCalled();
  });

  it('should fetch from API when forceRefresh is true', async () => {
    const cachedPersonalInfo: personalInfoState = {
      pId: '12345678901',
      phoneNumber: '555999333',
      loading: false,
      error: null,
      phoneUpdateChallengeId: null,
      phoneUpdateLoading: false,
      phoneUpdateError: null,
      phoneUpdatePendingPhone: null,
      phoneUpdateResendCount: 0,
    };

    store.overrideSelector(selectPersonalInfo, cachedPersonalInfo);
    store.refreshState();

    (apiService.getPersonalInfo as any).mockReturnValue(of(mockDto));

    actions$ = of(PersonalInfoActions.loadPersonalInfo({ forceRefresh: true }));
    const action = await firstValueFrom(effects.loadPersonalInfo$);

    expect(action).toEqual(
      PersonalInfoActions.loadPersonalInfoSuccess({
        personalInfo: {
          pId: mockDto.pId,
          phoneNumber: mockDto.phone,
          loading: false,
          error: null,
          phoneUpdateChallengeId: cachedPersonalInfo.phoneUpdateChallengeId,
          phoneUpdateLoading: cachedPersonalInfo.phoneUpdateLoading,
          phoneUpdateError: cachedPersonalInfo.phoneUpdateError,
          phoneUpdatePendingPhone: cachedPersonalInfo.phoneUpdatePendingPhone,
          phoneUpdateResendCount: cachedPersonalInfo.phoneUpdateResendCount,
        },
      }),
    );

    expect(apiService.getPersonalInfo).toHaveBeenCalledTimes(1);
  });

  it('should reset personal info on user change', async () => {
    actions$ = of(UserInfoActions.loadUser());
    const action = await firstValueFrom(effects.resetPersonalInfoOnUserChange$);
    expect(action).toEqual(PersonalInfoActions.resetPersonalInfo());
  });

  it('should handle HttpErrorResponse with string error', async () => {
    (apiService.updatePersonalInfo as any).mockReturnValue(
      throwError(() => new HttpErrorResponse({ error: 'String error', status: 400 })),
    );
    actions$ = of(PersonalInfoActions.updatePersonalInfo({ personalInfo: basePersonalInfoPayload }));
    const action = await firstValueFrom(effects.updatePersonalInfo$);
    expect(action).toEqual(PersonalInfoActions.updatePersonalInfoFailure({ error: 'String error' }));
  });

  it('should handle initiatePhoneUpdate', async () => {
    const phone = '555123456';
    const mockResponse = { challengeId: 'challenge-123', method: 'SMS' };

    (apiService.initiatePhoneUpdate as any).mockReturnValue(of(mockResponse));
    actions$ = of(PersonalInfoActions.initiatePhoneUpdate({ phone }));
    const action = await firstValueFrom(effects.initiatePhoneUpdate$);

    expect(action).toEqual(PersonalInfoActions.initiatePhoneUpdateSuccess({ challengeId: mockResponse.challengeId, method: mockResponse.method }));
    expect(apiService.initiatePhoneUpdate).toHaveBeenCalledWith(phone);
  });

  it('should handle verifyPhoneUpdate', async () => {
    const challengeId = 'challenge-123';
    const code = '123456';
    const mockResponse = { message: 'Phone number updated successfully' };

    (apiService.verifyPhoneUpdate as any).mockReturnValue(of(mockResponse));
    actions$ = of(PersonalInfoActions.verifyPhoneUpdate({ challengeId, code }));
    const action = await firstValueFrom(effects.verifyPhoneUpdate$);

    expect(action).toEqual(PersonalInfoActions.verifyPhoneUpdateSuccess({ message: mockResponse.message }));
    expect(apiService.verifyPhoneUpdate).toHaveBeenCalledWith(challengeId, code);
  });

  it('should handle resendPhoneOtp', async () => {
    const challengeId = 'challenge-123';

    (apiService.resendPhoneOtp as any).mockReturnValue(of({ success: true }));
    actions$ = of(PersonalInfoActions.resendPhoneOTP({ challengeId }));
    const action = await firstValueFrom(effects.resendPhoneOtp$);

    expect(action).toEqual(PersonalInfoActions.resendPhoneOTPSuccess());
    expect(apiService.resendPhoneOtp).toHaveBeenCalledWith(challengeId);
  });

  it('should handle updatePersonalInfo error', async () => {
    (apiService.updatePersonalInfo as any).mockReturnValue(throwError(() => new Error('Update failed')));
    actions$ = of(PersonalInfoActions.updatePersonalInfo({ personalInfo: basePersonalInfoPayload }));
    const action = await firstValueFrom(effects.updatePersonalInfo$);
    expect(action).toEqual(PersonalInfoActions.updatePersonalInfoFailure({ error: 'Update failed' }));
  });

  it('should handle initiatePhoneUpdate error', async () => {
    (apiService.initiatePhoneUpdate as any).mockReturnValue(throwError(() => new Error('Failed')));
    actions$ = of(PersonalInfoActions.initiatePhoneUpdate({ phone: '555123456' }));
    const action = await firstValueFrom(effects.initiatePhoneUpdate$);
    expect(action).toEqual(PersonalInfoActions.initiatePhoneUpdateFailure({ error: 'Failed' }));
  });

  it('should handle verifyPhoneUpdate error', async () => {
    (apiService.verifyPhoneUpdate as any).mockReturnValue(throwError(() => new Error('Failed')));
    actions$ = of(PersonalInfoActions.verifyPhoneUpdate({ challengeId: 'challenge-123', code: '123456' }));
    const action = await firstValueFrom(effects.verifyPhoneUpdate$);
    expect(action).toEqual(PersonalInfoActions.verifyPhoneUpdateFailure({ error: 'Failed' }));
  });

  it('should handle resendPhoneOtp error', async () => {
    (apiService.resendPhoneOtp as any).mockReturnValue(throwError(() => new Error('Failed')));
    actions$ = of(PersonalInfoActions.resendPhoneOTP({ challengeId: 'challenge-123' }));
    const action = await firstValueFrom(effects.resendPhoneOtp$);
    expect(action).toEqual(PersonalInfoActions.resendPhoneOTPFailure({ error: 'Failed' }));
  });

  it('should handle updatePersonalInfo HttpErrorResponse with array message', async () => {
    (apiService.updatePersonalInfo as any).mockReturnValue(throwError(() => new HttpErrorResponse({ error: { message: ['Error'] }, status: 400 })));
    actions$ = of(PersonalInfoActions.updatePersonalInfo({ personalInfo: basePersonalInfoPayload }));
    const action = await firstValueFrom(effects.updatePersonalInfo$);
    expect(action).toEqual(PersonalInfoActions.updatePersonalInfoFailure({ error: 'Error' }));
  });

  it('should handle initiatePhoneUpdate HttpErrorResponse with string error', async () => {
    (apiService.initiatePhoneUpdate as any).mockReturnValue(throwError(() => new HttpErrorResponse({ error: 'String error', status: 400 })));
    actions$ = of(PersonalInfoActions.initiatePhoneUpdate({ phone: '555123456' }));
    const action = await firstValueFrom(effects.initiatePhoneUpdate$);
    expect(action).toEqual(PersonalInfoActions.initiatePhoneUpdateFailure({ error: 'String error' }));
  });

  it('should handle verifyPhoneUpdate HttpErrorResponse with array message', async () => {
    (apiService.verifyPhoneUpdate as any).mockReturnValue(throwError(() => new HttpErrorResponse({ error: { message: ['Error'] }, status: 400 })));
    actions$ = of(PersonalInfoActions.verifyPhoneUpdate({ challengeId: 'challenge-123', code: '123456' }));
    const action = await firstValueFrom(effects.verifyPhoneUpdate$);
    expect(action).toEqual(PersonalInfoActions.verifyPhoneUpdateFailure({ error: 'Error' }));
  });

  it('should handle HttpErrorResponse errors in phone update effects', async () => {
    (apiService.initiatePhoneUpdate as any).mockReturnValue(throwError(() => new HttpErrorResponse({ error: { message: 'Error' }, status: 400 })));
    actions$ = of(PersonalInfoActions.initiatePhoneUpdate({ phone: '555123456' }));
    const action = await firstValueFrom(effects.initiatePhoneUpdate$);
    expect(action).toEqual(PersonalInfoActions.initiatePhoneUpdateFailure({ error: 'Error' }));
  });

  it('should handle updatePersonalInfo with error.message', async () => {
    const error = new HttpErrorResponse({ error: {}, status: 400 });
    Object.defineProperty(error, 'message', { value: 'Error message', writable: true });
    (apiService.updatePersonalInfo as any).mockReturnValue(throwError(() => error));
    actions$ = of(PersonalInfoActions.updatePersonalInfo({ personalInfo: basePersonalInfoPayload }));
    const action = await firstValueFrom(effects.updatePersonalInfo$);
    expect(action).toEqual(PersonalInfoActions.updatePersonalInfoFailure({ error: 'Error message' }));
  });
});

