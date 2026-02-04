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
import { SecurityActions } from '../store/security.actions';
import { Store } from '@ngrx/store';
import { vi } from 'vitest';

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
        provideStore(),
        provideEffects(SecurityEffects),
        SecurityService,
        provideStore({ security: securityFeature.reducer }),
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

  it('calls backend and dispatches changePassword action', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
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

    req.flush(null);

    expect(dispatchSpy).toHaveBeenCalledWith(
      SecurityActions.changePassword({
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword456',
      }),
    );
  });
});

