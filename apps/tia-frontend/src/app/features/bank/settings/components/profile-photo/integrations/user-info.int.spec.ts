import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { personalInfoFeature } from '../../../../../../store/personal-info/personal-info.reducer';
import { PersonalInfoEffects } from '../../../../../../store/personal-info/personal-info.effects';
import { ProfilePhotoContainer } from '../container/profile-photo-container';
import { profilePhotoFeature } from '../store/profile-photo/profile-photo.reducer';
import { ProfilePhotoEffects } from '../store/profile-photo/profile-photo.effects';
import { PersonalInfoApiService } from '../../../../../../shared/services/personal-info/personal-info.api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../../../../environments/environment';
import { Store } from '@ngrx/store';
import * as PersonalInfoSelectors from '../../../../../../store/personal-info/personal-info.selectors';
import { take, timeout, filter } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { Router } from '@angular/router';
import { userInfoFeature } from '../../../../../../store/user-info/user-info.reducer';
import { UserInfoEffects } from '../../../../../../store/user-info/user-info.effect';
import { UserInfoService } from '../../../../../../shared/services/user-info/user-info.service';
import { PersonalInfoActions } from '../../../../../../store/personal-info/pesronal-info.actions';
import { vi } from 'vitest';

const routes: Routes = [
  {
    path: 'bank/settings/profile-photo',
    component: ProfilePhotoContainer,
  },
];

const mockPersonalInfo = {
  pId: '12345678901',
  phoneNumber: '555123456',
  loading: false,
  error: null,
  phoneUpdateChallengeId: null,
  phoneUpdateLoading: false,
  phoneUpdateError: null,
  phoneUpdatePendingPhone: null,
  phoneUpdateResendCount: 0,
};

describe('UserInfo integration', () => {
  let fixture: ComponentFixture<ProfilePhotoContainer>;
  let httpMock: HttpTestingController;
  let store: Store;
  let mockAlertService: any;
  let mockRouter: any;

  beforeEach(async () => {
    TestBed.resetTestingModule();

    mockAlertService = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProfilePhotoContainer],
      providers: [
        provideRouter(routes),
        provideTranslateService(),
        provideStore({
          personalInfo: personalInfoFeature.reducer,
          'user-info': userInfoFeature.reducer,
          ProfilePhoto: profilePhotoFeature.reducer,
        }),
        provideEffects([PersonalInfoEffects, UserInfoEffects, ProfilePhotoEffects]),
        PersonalInfoApiService,
        UserInfoService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AlertService, useValue: mockAlertService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePhotoContainer);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
    fixture.detectChanges();


    const userInfoReq = httpMock.expectOne(`${environment.apiUrl}/users/current-user`);
    userInfoReq.flush({ fullName: 'Test User', avatar: null });

    const avatarReq = httpMock.expectOne(`${environment.apiUrl}/settings/get-available-default-avatars`);
    avatarReq.flush([]);

    const personalInfoReq = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info`);
    personalInfoReq.flush({ pId: null, phone: null });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load personal info on init and update state', async () => {
    const component = fixture.componentInstance;

    component.ngOnInit();

    
    const avatarReq = httpMock.expectOne(`${environment.apiUrl}/settings/get-available-default-avatars`);
    avatarReq.flush([]);

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info`);
    expect(req.request.method).toBe('GET');

    req.flush({ pId: '12345678901', phone: '555123456' });
    fixture.detectChanges();

    const pId = await firstValueFrom(
      store.select(PersonalInfoSelectors.selectPId).pipe(take(1), timeout(3000)),
    );
    const phoneNumber = await firstValueFrom(
      store.select(PersonalInfoSelectors.selectPhoneNumber).pipe(take(1), timeout(3000)),
    );

    expect(pId).toBe('12345678901');
    expect(phoneNumber).toBe('555123456');
  });

  it('should update personal number and update state', async () => {
    const component = fixture.componentInstance;

    store.dispatch(
      PersonalInfoActions.loadPersonalInfoSuccess({ personalInfo: mockPersonalInfo }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    component.onEdit();
    component.onPersonalNumberChange('98765432109');
    component.onSave();

 
    const req = httpMock.expectOne(
      (request) =>
        request.url === `${environment.apiUrl}/settings/personal-info` &&
        request.method === 'PUT',
    );
    expect(req.request.body).toEqual({ pId: '98765432109' });

    req.flush({ message: 'Success' });
    fixture.detectChanges();

    const pId = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPId)
        .pipe(filter((id) => id === '98765432109'), take(1), timeout(3000)),
    );

    expect(pId).toBe('98765432109');
  });

  it('should initiate phone update and set challengeId', async () => {
    const component = fixture.componentInstance;

    store.dispatch(
      PersonalInfoActions.loadPersonalInfoSuccess({ personalInfo: mockPersonalInfo }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    component.onEdit();
    component.onPhoneNumberChange('555987654');
    component.onSave();

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info/update-phone`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ phone: '555987654' });

    req.flush({ challengeId: 'challenge-123', method: 'SMS' });
    fixture.detectChanges();

    const challengeId = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPhoneUpdateChallengeId)
        .pipe(filter((id) => id === 'challenge-123'), take(1), timeout(3000)),
    );

    expect(challengeId).toBe('challenge-123');
  });

  it('should verify phone update and update phone number', async () => {
    const component = fixture.componentInstance;


    store.dispatch(
      PersonalInfoActions.initiatePhoneUpdate({ phone: '555987654' }),
    );
    fixture.detectChanges();
    
  
    const initiateReq = httpMock.expectOne(
      `${environment.apiUrl}/settings/personal-info/update-phone`,
    );
    expect(initiateReq.request.method).toBe('POST');
    initiateReq.flush({ challengeId: 'challenge-123', method: 'SMS' });
    
    fixture.detectChanges();
    await fixture.whenStable();
    
  
    store.dispatch(
      PersonalInfoActions.loadPersonalInfoSuccess({
        personalInfo: mockPersonalInfo,
      }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

  
    const challengeId = component.phoneUpdateChallengeId();
    expect(challengeId).toBe('challenge-123');

   
    component.onVerifyOtp('1234');

    const req = httpMock.expectOne(
      `${environment.apiUrl}/settings/personal-info/verify-new-phone-otp`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ challengeId: 'challenge-123', code: '1234' });

    req.flush({ message: 'Success' });
    fixture.detectChanges();
    await fixture.whenStable();


    const matchingRequests = httpMock.match(
      (request) =>
        request.url === `${environment.apiUrl}/settings/personal-info` &&
        request.method === 'GET',
    );


    if (matchingRequests.length > 0) {
      matchingRequests[0].flush({ pId: '12345678901', phone: '555987654' });
      fixture.detectChanges();
    }


    const phoneNumber = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPhoneNumber)
        .pipe(filter((phone) => phone === '555987654'), take(1), timeout(3000)),
    );

    expect(phoneNumber).toBe('555987654');
  });

  it('should handle error when loading personal info fails', async () => {
    const component = fixture.componentInstance;

    component.ngOnInit();


    const avatarReq = httpMock.expectOne(`${environment.apiUrl}/settings/get-available-default-avatars`);
    avatarReq.flush([]);

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info`);
    req.flush({ message: 'Error' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    const error = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfoError)
        .pipe(filter((err) => !!err), take(1), timeout(3000)),
    );

    expect(error).toBeTruthy();
  });
});
