import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../../../../environments/environment';
import { PersonalInfoEffects } from '../../../../../../store/personal-info/personal-info.effects';
import { personalInfoFeature } from '../../../../../../store/personal-info/personal-info.reducer';
import { PersonalInfoActions } from '../../../../../../store/personal-info/pesronal-info.actions';
import * as PersonalInfoSelectors from '../../../../../../store/personal-info/personal-info.selectors';
import { firstValueFrom, take, timeout } from 'rxjs';

describe('Personal Info Integration', () => {
  let store: Store;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/settings/personal-info`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideStore({ personalInfo: personalInfoFeature.reducer }),
        provideEffects(PersonalInfoEffects),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update PID successfully', async () => {
    const newPId = '12345678901';
    
    store.dispatch(
      PersonalInfoActions.updatePersonalInfo({
        personalInfo: {
          pId: newPId,
          phoneNumber: null,
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

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ pId: newPId });

    req.flush({ message: 'PID updated successfully' });


    await new Promise(resolve => setTimeout(resolve, 50));

 
    const state = await firstValueFrom(
      store.select(PersonalInfoSelectors.selectPersonalInfo).pipe(take(1), timeout(1000))
    );

    expect(state.pId).toBe(newPId);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should initiate phone update successfully', async () => {
    const newPhone = '555123456';

    store.dispatch(PersonalInfoActions.initiatePhoneUpdate({ phone: newPhone }));

    const req = httpMock.expectOne(`${baseUrl}/update-phone`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ phone: newPhone });

    const mockResponse = { challengeId: 'challenge-123', method: 'SMS' };
    req.flush(mockResponse);

    
    await new Promise(resolve => setTimeout(resolve, 50));

 
    const state = await firstValueFrom(
      store.select(PersonalInfoSelectors.selectPersonalInfo).pipe(take(1), timeout(1000))
    );

    expect(state.phoneUpdateChallengeId).toBe(mockResponse.challengeId);
    expect(state.phoneUpdateLoading).toBe(false);
    expect(state.phoneUpdateError).toBeNull();
  });
});