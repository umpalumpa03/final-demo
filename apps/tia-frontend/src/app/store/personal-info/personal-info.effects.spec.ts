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

describe('PersonalInfoEffects (Vitest)', () => {
  let actions$: Observable<Action>;
  let effects: PersonalInfoEffects;
  let store: MockStore;
  let apiService: {
    getPersonalInfo: ReturnType<typeof vi.fn>;
    updatePersonalInfo: ReturnType<typeof vi.fn>;
  };

  const mockDto: PersonalInfoDto = {
    pId: '12345678901',
    phone: '555999333',
  };

  const basePersonalInfoPayload = {
    pId: '12345678901',
    phoneNumber: '555999333',
    loading: false,
    error: null,
  };

  beforeEach(() => {
    apiService = {
      getPersonalInfo: vi.fn(),
      updatePersonalInfo: vi.fn(),
    };

    actions$ = of(PersonalInfoActions.loadPersonalInfo({}));

    TestBed.configureTestingModule({
      providers: [
        PersonalInfoEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: selectPersonalInfo, value: { pId: null, phoneNumber: null, loading: false, error: null } },
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
    };

    store.overrideSelector(selectPersonalInfo, cachedPersonalInfo);
    store.refreshState();

    actions$ = of(PersonalInfoActions.loadPersonalInfo({}));
    const action = await firstValueFrom(effects.loadPersonalInfo$);

    expect(action).toEqual(
      PersonalInfoActions.loadPersonalInfoSuccess({
        personalInfo: cachedPersonalInfo,
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
        },
      }),
    );

    expect(apiService.getPersonalInfo).toHaveBeenCalledTimes(1);
  });
});

