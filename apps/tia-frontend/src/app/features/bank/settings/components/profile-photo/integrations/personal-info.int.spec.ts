import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { firstValueFrom, take, timeout, filter } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { personalInfoFeature } from '../../../../../../store/personal-info/personal-info.reducer';
import { PersonalInfoActions } from '../../../../../../store/personal-info/pesronal-info.actions';
import * as PersonalInfoSelectors from '../../../../../../store/personal-info/personal-info.selectors';

describe('PersonalInfo integration', () => {
  let httpMock: HttpTestingController;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideStore({
          personalInfo: personalInfoFeature.reducer,
        }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should update loading state when loading personal info', async () => {
    store.dispatch(PersonalInfoActions.loadPersonalInfo({}));

    const loading = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfoLoading)
        .pipe(filter(loading => loading === true), take(1), timeout(1000))
    );

    expect(loading).toBe(true);
  });

  it('should update state when loading personal info succeeds', async () => {
    const mockPersonalInfo = {
      pId: '12345',
      phoneNumber: '+995555123456',
      loading: false,
      error: null,
      phoneUpdateChallengeId: null,
      phoneUpdateLoading: false,
      phoneUpdateError: null,
      phoneUpdatePendingPhone: null,
      phoneUpdateResendCount: 0,
    };

    store.dispatch(PersonalInfoActions.loadPersonalInfoSuccess({ personalInfo: mockPersonalInfo }));

    const state = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfo)
        .pipe(filter(state => state?.pId === '12345'), take(1), timeout(1000))
    );

    expect(state).toBeTruthy();
    if (state) {
      expect(state.pId).toBe('12345');
      expect(state.phoneNumber).toBe('+995555123456');
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    }
  });

  it('should update error state when loading personal info fails', async () => {
    const errorMessage = 'Failed to load personal info';

    store.dispatch(PersonalInfoActions.loadPersonalInfoFailure({ error: errorMessage }));

    const error = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfoError)
        .pipe(take(1), timeout(1000))
    );

    expect(error).toBe(errorMessage);
  });

  it('should update phone number directly', async () => {
    store.dispatch(PersonalInfoActions.loadPersonalInfoPhoneNumber({ phoneNumber: '+995555999888' }));

    const phoneNumber = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPhoneNumber)
        .pipe(filter(phone => phone === '+995555999888'), take(1), timeout(1000))
    );

    expect(phoneNumber).toBe('+995555999888');
  });

  it('should update pId directly', async () => {
    store.dispatch(PersonalInfoActions.loadPersonalInfoPId({ pId: '67890' }));

    const pId = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPId)
        .pipe(filter(id => id === '67890'), take(1), timeout(1000))
    );

    expect(pId).toBe('67890');
  });

  it('should reset personal info to initial state', async () => {
  
    store.dispatch(PersonalInfoActions.loadPersonalInfoPId({ pId: '12345' }));
    store.dispatch(PersonalInfoActions.loadPersonalInfoPhoneNumber({ phoneNumber: '+995555123456' }));

    
    store.dispatch(PersonalInfoActions.resetPersonalInfo());

    const state = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfo)
        .pipe(filter(state => state?.pId === null && state?.phoneNumber === ''), take(1), timeout(1000))
    );

    expect(state).toBeTruthy();
    if (state) {
      expect(state.pId).toBeNull();
      expect(state.phoneNumber).toBe('');
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    }
  });
});
