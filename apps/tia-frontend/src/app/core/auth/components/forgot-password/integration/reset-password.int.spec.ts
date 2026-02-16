import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { ResetPassword } from '../reset-password/reset-password';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { MonitorInactivity } from '../../../services/monitor-inacticity.service';
import { environment } from '../../../../../../environments/environment';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';
import { CreateNewPasswordResponse } from '../../../models/authResponse.model';

describe('ResetPassword Component Integration', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let httpMock: HttpTestingController;
  let alertService: AlertService;
  let tokenService: TokenService;
  let router: Router;

  const baseUrl: string = `${environment.apiUrl}/auth`;

  const monitorMock: Partial<MonitorInactivity> = {
    inactivity$: {
      pipe: () => ({ subscribe: () => ({}) }),
    } as MonitorInactivity['inactivity$'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
        provideRouter([]),
        provideStore({}),
        AuthService,
        TokenService,
        AlertService,
        { provide: MonitorInactivity, useValue: monitorMock },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    alertService = TestBed.inject(AlertService);
    tokenService = TestBed.inject(TokenService);
    router = TestBed.inject(Router);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  function createWithToken(): void {
    tokenService.setResetPasswordToken('valid-reset-token');
    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should redirect to OTP page if no reset token', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/auth', 'verify-otp-reset']);
  });

  it('should not redirect if reset token exists', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    createWithToken();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should submit password and call success alert', () => {
    createWithToken();

    const successSpy = vi.spyOn(alertService, 'success');
    const formValue: IRegistrationForm = {
      firstName: 'John',
      password: 'NewPassword123!',
      username: 'john',
    };

    component.submit(formValue);
    expect(component.isSubmitting()).toBe(true);

    const req = httpMock.expectOne(`${baseUrl}/create-new-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ password: 'NewPassword123!' });
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer valid-reset-token',
    );

    const mockResponse: CreateNewPasswordResponse = { success: true };
    req.flush(mockResponse);

    expect(component.isSubmitting()).toBe(false);
    expect(successSpy).toHaveBeenCalledWith(
      'auth.reset-password.alerts.passwordUpdated',
      expect.objectContaining({ variant: 'dismissible' }),
    );
  });

  it('should call error alert on 400 response', () => {
    createWithToken();

    const errorSpy = vi.spyOn(alertService, 'error');
    const formValue: IRegistrationForm = {
      firstName: 'John',
      password: 'weak',
      username: 'john',
    };

    component.submit(formValue);

    const req = httpMock.expectOne(`${baseUrl}/create-new-password`);
    req.flush(
      { message: 'Password too weak' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(component.isSubmitting()).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      'auth.reset-password.alerts.unableToReset',
      expect.objectContaining({ variant: 'dismissible' }),
    );
  });

  it('should call warning alert on generic server error', () => {
    createWithToken();

    const warningSpy = vi.spyOn(alertService, 'warning');
    const formValue: IRegistrationForm = {
      firstName: 'John',
      password: 'NewPassword123!',
      username: 'john',
    };

    component.submit(formValue);

    const req = httpMock.expectOne(`${baseUrl}/create-new-password`);
    req.flush(null, { status: 500, statusText: 'Server Error' });

    expect(component.isSubmitting()).toBe(false);
    expect(warningSpy).toHaveBeenCalledWith(
      'auth.reset-password.alerts.somethingWentWrong',
      expect.objectContaining({ variant: 'dismissible' }),
    );
  });

  it('should clear alert before submitting', () => {
    createWithToken();

    const clearSpy = vi.spyOn(alertService, 'clearAlert');
    const formValue: IRegistrationForm = {
      firstName: 'John',
      password: 'NewPassword123!',
      username: 'john',
    };

    component.submit(formValue);

    expect(clearSpy).toHaveBeenCalled();

    const req = httpMock.expectOne(`${baseUrl}/create-new-password`);
    req.flush({ success: true });
  });

  it('should set isSubmitting to false after error', () => {
    createWithToken();

    const formValue: IRegistrationForm = {
      firstName: 'John',
      password: 'NewPassword123!',
      username: 'john',
    };

    component.submit(formValue);
    expect(component.isSubmitting()).toBe(true);

    const req = httpMock.expectOne(`${baseUrl}/create-new-password`);
    req.flush(null, { status: 500, statusText: 'Server Error' });

    expect(component.isSubmitting()).toBe(false);
  });
});
