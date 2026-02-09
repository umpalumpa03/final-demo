import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { personalInfoFeature } from '../../../../../../store/personal-info/personal-info.reducer';
import { PersonalInfoEffects } from '../../../../../../store/personal-info/personal-info.effects';
import { PersonalInfoApiService } from '../../../../../../shared/services/personal-info/personal-info.api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../../../../environments/environment';
import { Store } from '@ngrx/store';
import * as PersonalInfoSelectors from '../../../../../../store/personal-info/personal-info.selectors';
import { take, timeout, filter } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { PersonalInfoActions } from '../../../../../../store/personal-info/pesronal-info.actions';

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

describe('Personal Info integration', () => {
  let httpMock: HttpTestingController;
  let store: Store;

  beforeEach(async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      providers: [
        provideStore({
          personalInfo: personalInfoFeature.reducer,
        }),
        provideEffects([PersonalInfoEffects]),
        PersonalInfoApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load personal info and update state', async () => {
    store.dispatch(PersonalInfoActions.loadPersonalInfo({}));

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info`);
    expect(req.request.method).toBe('GET');

    req.flush({ pId: '12345678901', phone: '555123456' });

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
    store.dispatch(
      PersonalInfoActions.loadPersonalInfoSuccess({ personalInfo: mockPersonalInfo }),
    );

    store.dispatch(
      PersonalInfoActions.updatePersonalInfo({
        personalInfo: {
          ...mockPersonalInfo,
          pId: '98765432109',
        },
      }),
    );

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${environment.apiUrl}/settings/personal-info` &&
        request.method === 'PUT',
    );
    expect(req.request.body).toEqual({ pId: '98765432109' });

    req.flush({ message: 'Success' });

 
    await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfoLoading)
        .pipe(
          filter((isLoading) => !isLoading),
          take(1),
          timeout(10000),
        ),
    );

   
    const pId = await firstValueFrom(
      store.select(PersonalInfoSelectors.selectPId).pipe(take(1), timeout(1000)),
    );

    expect(pId).toBe('98765432109');
  });

  it('should initiate phone update and set challengeId', async () => {
    store.dispatch(
      PersonalInfoActions.loadPersonalInfoSuccess({ personalInfo: mockPersonalInfo }),
    );

    store.dispatch(PersonalInfoActions.initiatePhoneUpdate({ phone: '555987654' }));

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info/update-phone`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ phone: '555987654' });

    req.flush({ challengeId: 'challenge-123', method: 'SMS' });

    const challengeId = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPhoneUpdateChallengeId)
        .pipe(filter((id) => id === 'challenge-123'), take(1), timeout(3000)),
    );

    expect(challengeId).toBe('challenge-123');
  });

  it('should verify phone update and update phone number', async () => {
    store.dispatch(
      PersonalInfoActions.loadPersonalInfoSuccess({ personalInfo: mockPersonalInfo }),
    );

    store.dispatch(PersonalInfoActions.initiatePhoneUpdate({ phone: '555987654' }));

    const initiateReq = httpMock.expectOne(
      `${environment.apiUrl}/settings/personal-info/update-phone`,
    );
    expect(initiateReq.request.method).toBe('POST');
    initiateReq.flush({ challengeId: 'challenge-123', method: 'SMS' });

    await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPhoneUpdateChallengeId)
        .pipe(filter((id) => id === 'challenge-123'), take(1), timeout(10000)),
    );

    store.dispatch(
      PersonalInfoActions.verifyPhoneUpdate({ challengeId: 'challenge-123', code: '1234' }),
    );

    const req = httpMock.expectOne(
      `${environment.apiUrl}/settings/personal-info/verify-new-phone-otp`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ challengeId: 'challenge-123', code: '1234' });

    req.flush({ message: 'Success' });

 
    await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPhoneUpdateLoading)
        .pipe(
          filter((loading) => !loading),
          take(1),
          timeout(10000),
        ),
    );

  
    const phoneAfterVerify = await firstValueFrom(
      store.select(PersonalInfoSelectors.selectPhoneNumber).pipe(take(1), timeout(1000)),
    );
    expect(phoneAfterVerify).toBe('555987654');

    store.dispatch(PersonalInfoActions.loadPersonalInfo({ forceRefresh: true }));

    const personalInfoReq = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info`);
    personalInfoReq.flush({ pId: '12345678901', phone: '555987654' });

   
    await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfoLoading)
        .pipe(
          filter((isLoading) => !isLoading),
          take(1),
          timeout(10000),
        ),
    );


    const phoneNumber = await firstValueFrom(
      store.select(PersonalInfoSelectors.selectPhoneNumber).pipe(take(1), timeout(1000)),
    );

    expect(phoneNumber).toBe('555987654');
  });

  it('should handle error when loading personal info fails', async () => {
    store.dispatch(PersonalInfoActions.loadPersonalInfo({}));

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/personal-info`);
    req.flush({ message: 'Error' }, { status: 400, statusText: 'Bad Request' });

    const error = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfoError)
        .pipe(filter((err) => !!err), take(1), timeout(3000)),
    );

    expect(error).toBeTruthy();
  });
});
