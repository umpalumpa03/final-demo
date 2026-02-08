import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { securityFeature } from '../store/security.reducer';
import { SecurityEffects } from '../store/security.effects';
import { SecurityContainer } from '../container/security-container';
import { SecurityService } from '../service/security.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../../../../environments/environment';
import { Store } from '@ngrx/store';
import * as SecuritySelectors from '../store/security.selectors';
import { take, timeout, filter } from 'rxjs';
import { firstValueFrom } from 'rxjs';

const routes: Routes = [
  {
    path: 'bank/settings/security',
    component: SecurityContainer,
  },
];

describe('SecurityContainer integration', () => {
  let fixture: ComponentFixture<SecurityContainer>;
  let httpMock: HttpTestingController;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityContainer],
      providers: [
        provideRouter(routes),
        provideTranslateService(),
        provideStore({ security: securityFeature.reducer }),
        provideEffects(SecurityEffects),
        SecurityService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityContainer);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should complete full flow: dispatch action -> effect calls service -> success -> state updates', async () => {
    const component = fixture.componentInstance;

    component.onChangePassword({
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword456',
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/settings/change-password`,
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword456',
    });

    fixture.detectChanges();
    await fixture.whenStable();
    let loading = await firstValueFrom(store.select(SecuritySelectors.selectSecurityLoading).pipe(take(1), timeout(5000)));
    expect(loading).toBe(true);

    req.flush(null);
    fixture.detectChanges();

   
    loading = await firstValueFrom(
      store.select(SecuritySelectors.selectSecurityLoading).pipe(
        filter(loading => loading === false),
        take(1),
        timeout(5000)
      )
    );
    

    const success = await firstValueFrom(store.select(SecuritySelectors.selectSecuritySuccess).pipe(take(1), timeout(5000)));
    const error = await firstValueFrom(store.select(SecuritySelectors.selectSecurityError).pipe(take(1), timeout(5000)));

    expect(loading).toBe(false);
    expect(success).toBe(true);
    expect(error).toBeNull();
  });

  it('should handle error flow: dispatch action -> effect calls service -> error -> state updates', async () => {
    const component = fixture.componentInstance;
    const errorMessage = 'Invalid current password';

    component.onChangePassword({
      currentPassword: 'wrongPassword',
      newPassword: 'newPassword456',
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/settings/change-password`,
    );

    fixture.detectChanges();
    await fixture.whenStable();
    let loading = await firstValueFrom(store.select(SecuritySelectors.selectSecurityLoading).pipe(take(1), timeout(5000)));
    expect(loading).toBe(true);

    req.flush(
      { message: errorMessage },
      { status: 400, statusText: 'Bad Request' }
    );

    fixture.detectChanges();

 
    loading = await firstValueFrom(
      store.select(SecuritySelectors.selectSecurityLoading).pipe(
        filter(loading => loading === false),
        take(1),
        timeout(5000)
      )
    );
    
 
    const success = await firstValueFrom(store.select(SecuritySelectors.selectSecuritySuccess).pipe(take(1), timeout(5000)));
    const error = await firstValueFrom(store.select(SecuritySelectors.selectSecurityError).pipe(take(1), timeout(5000)));

    expect(loading).toBe(false);
    expect(success).toBe(false);
    expect(error).toBe(errorMessage);
  });
});

