import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { firstValueFrom, filter, take, timeout } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';

import { ProfilePhotoContainer } from '../../profile-photo/container/profile-photo-container';

import { personalInfoFeature } from '../../../../../../store/personal-info/personal-info.reducer';
import { PersonalInfoEffects } from '../../../../../../store/personal-info/personal-info.effects';
import { PersonalInfoApiService } from '../../../../../../shared/services/personal-info/personal-info.api.service';
import { PersonalInfoActions } from '../../../../../../store/personal-info/pesronal-info.actions';
import * as PersonalInfoSelectors from '../../../../../../store/personal-info/personal-info.selectors';

import { profilePhotoFeature } from '../../profile-photo/store/profile-photo/profile-photo.reducer';
import { userInfoFeature } from '../../../../../../store/user-info/user-info.reducer';

import { AlertService } from '@tia/core/services/alert/alert.service';

const routes: Routes = [
  {
    path: 'bank/settings/profile-photo',
    component: ProfilePhotoContainer,
  },
];

describe('PersonalInfoContainer integration (CI stable)', () => {
  let fixture: ComponentFixture<ProfilePhotoContainer>;
  let httpMock: HttpTestingController;
  let store: Store;

  const mockAlertService = {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    clearAlert: vi.fn(),
  };


  const waitFor = <T>(
    obs$: any,
    predicate: (v: T) => boolean,
    ms = 5000,
  ): Promise<T> => {
    return firstValueFrom(
      obs$.pipe(filter((v: T) => predicate(v)), take(1), timeout(ms)),
    );
  };

  const seedPersonalInfo = (overrides?: Partial<any>) => {
    store.dispatch(
      PersonalInfoActions.loadPersonalInfoSuccess({
        personalInfo: {
          pId: null,
          phoneNumber: '555123456',
          loading: false,
          error: null,
          phoneUpdateChallengeId: null,
          phoneUpdateLoading: false,
          phoneUpdateError: null,
          phoneUpdatePendingPhone: null,
          phoneUpdateResendCount: 0,
          ...(overrides ?? {}),
        },
      }),
    );
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePhotoContainer],
      providers: [
        provideRouter(routes),
        provideTranslateService(),
        provideStore({
          personalInfo: personalInfoFeature.reducer,
          ProfilePhoto: profilePhotoFeature.reducer,
          'user-info': userInfoFeature.reducer,
        }),
        provideEffects(PersonalInfoEffects),
        PersonalInfoApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AlertService,
          useValue: mockAlertService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePhotoContainer);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('full flow (success): update personal info -> http -> success -> state updates', async () => {
    const component = fixture.componentInstance;

    seedPersonalInfo({ pId: null, phoneNumber: '555123456' });
    fixture.detectChanges();

   
    component.editedPId.set('12345678901');
    component.isEditing.set(true);

   
    component.onSave();

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ pId: '12345678901' });

    
    await waitFor<boolean>(
      store.select(PersonalInfoSelectors.selectPersonalInfoLoading),
      (v) => v === true,
    );

    req.flush({ message: 'Personal info updated successfully' });
    fixture.detectChanges();

   
    await waitFor<boolean>(
      store.select(PersonalInfoSelectors.selectPersonalInfoLoading),
      (v) => v === false,
    );
    await waitFor<string | null>(
      store.select(PersonalInfoSelectors.selectPersonalInfoError),
      (v) => v === null,
    );
  });

  it('full flow (error): update personal info -> http -> failure -> state updates', async () => {
    const component = fixture.componentInstance;
    const errorMessage = 'Invalid personal number';

    seedPersonalInfo({ pId: null, phoneNumber: '555123456' });
    fixture.detectChanges();

    component.editedPId.set('12345678901');
    component.isEditing.set(true);

    component.onSave();

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ pId: '12345678901' });

    await waitFor<boolean>(
      store.select(PersonalInfoSelectors.selectPersonalInfoLoading),
      (v) => v === true,
    );

    req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    await waitFor<boolean>(
      store.select(PersonalInfoSelectors.selectPersonalInfoLoading),
      (v) => v === false,
    );
    await waitFor<string | null>(
      store.select(PersonalInfoSelectors.selectPersonalInfoError),
      (v) => v === errorMessage,
    );
  });

  it('full flow (success): initiate phone update -> http -> success -> state updates', async () => {
    const component = fixture.componentInstance;

    seedPersonalInfo({ pId: '12345678901', phoneNumber: '555123456' });
    fixture.detectChanges();

    component.editedPhoneNumber.set('555987654');
    component.isEditing.set(true);

    component.onSave();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/settings/personal-info/update-phone`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ phone: '555987654' });

    await waitFor<boolean>(
      store.select(PersonalInfoSelectors.selectPhoneUpdateLoading),
      (v) => v === true,
    );

    req.flush({ challengeId: 'challenge-123', method: 'sms' });
    fixture.detectChanges();

    await waitFor<boolean>(
      store.select(PersonalInfoSelectors.selectPhoneUpdateLoading),
      (v) => v === false,
    );
    await waitFor<string | null>(
      store.select(PersonalInfoSelectors.selectPhoneUpdateChallengeId),
      (v) => v === 'challenge-123',
    );
    await waitFor<string | null>(
      store.select(PersonalInfoSelectors.selectPhoneUpdateError),
      (v) => v === null,
    );
  });

  it('full flow (error): initiate phone update -> http -> failure -> state updates', async () => {
    const component = fixture.componentInstance;
    const errorMessage = 'Invalid phone number';

    seedPersonalInfo({ pId: '12345678901', phoneNumber: '555123456' });
    fixture.detectChanges();

    component.editedPhoneNumber.set('555987654');
    component.isEditing.set(true);

    component.onSave();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/settings/personal-info/update-phone`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ phone: '555987654' });

    await waitFor<boolean>(
      store.select(PersonalInfoSelectors.selectPhoneUpdateLoading),
      (v) => v === true,
    );

    req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    await waitFor<boolean>(
      store.select(PersonalInfoSelectors.selectPhoneUpdateLoading),
      (v) => v === false,
    );
    await waitFor<string | null>(
      store.select(PersonalInfoSelectors.selectPhoneUpdateError),
      (v) => v === errorMessage,
    );
  });
});
