import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../../../../environments/environment';
import { PersonalInfoEffects } from '../../../../../../store/personal-info/personal-info.effects';
import { personalInfoFeature } from '../../../../../../store/personal-info/personal-info.reducer';
import { PersonalInfoActions } from '../../../../../../store/personal-info/pesronal-info.actions';
import * as PersonalInfoSelectors from '../../../../../../store/personal-info/personal-info.selectors';
import { firstValueFrom, take, timeout, skip } from 'rxjs';
import { ofType } from '@ngrx/effects';

describe('Personal Info Integration', () => {
  let store: Store;
  let httpMock: HttpTestingController;
  let actions$: Actions;
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
    actions$ = TestBed.inject(Actions);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update PID successfully', async () => {
    const newPId = '12345678901';
    
    const currentState = await firstValueFrom(
      store.select(PersonalInfoSelectors.selectPersonalInfo).pipe(take(1))
    );

    const successActionPromise = firstValueFrom(
      actions$.pipe(
        ofType(PersonalInfoActions.updatePersonalInfoSuccess),
        take(1)
      )
    );

    store.dispatch(
      PersonalInfoActions.updatePersonalInfo({
        personalInfo: {
          ...currentState,
          pId: newPId,
        },
      }),
    );

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ pId: newPId });

    req.flush({ message: 'PID updated successfully' });

    await successActionPromise;

    const state = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfo)
        .pipe(skip(1), take(1), timeout(1000))
    );

    expect(state).toBeTruthy();
    if (state) {
      expect(state.pId).toBe(newPId);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    }
  });

  it('should initiate phone update successfully', async () => {
    const newPhone = '555123456';
    const initialPhoneNumber = '123456789';

    store.dispatch(PersonalInfoActions.loadPersonalInfoPhoneNumber({ phoneNumber: initialPhoneNumber }));


    await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfo)
        .pipe(take(1), timeout(1000))
    );

    const successActionPromise = firstValueFrom(
      actions$.pipe(
        ofType(PersonalInfoActions.initiatePhoneUpdateSuccess),
        take(1)
      )
    );

    store.dispatch(PersonalInfoActions.initiatePhoneUpdate({ phone: newPhone }));

    const req = httpMock.expectOne(`${baseUrl}/update-phone`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ phone: newPhone });

    const mockResponse = { challengeId: 'challenge-123', method: 'SMS' };
    req.flush(mockResponse);

    await successActionPromise;


    const state = await firstValueFrom(
      store
        .select(PersonalInfoSelectors.selectPersonalInfo)
        .pipe(skip(1), take(1), timeout(1000))
    );

    expect(state).toBeTruthy();
    if (state) {
      expect(state.phoneUpdateChallengeId).toBe(mockResponse.challengeId);
      expect(state.phoneUpdateLoading).toBe(false);
      expect(state.phoneUpdateError).toBeNull();
      expect(state.phoneUpdatePendingPhone).toBe(newPhone);
      expect(state.phoneNumber).toBe(initialPhoneNumber);
    }
  });
});
