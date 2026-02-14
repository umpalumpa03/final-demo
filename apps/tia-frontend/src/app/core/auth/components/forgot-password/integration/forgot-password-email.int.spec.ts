import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideRouter, Router } from '@angular/router';
import {
  provideHttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { ForgotPasswordEmail } from '../forgot-password-email/forgot-password-email';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { MonitorInactivity } from '../../../services/monitor-inacticity.service';
import { environment } from '../../../../../../environments/environment';
import { ForgotPasswordResponse } from '../../../models/authResponse.model';

describe('ForgotPasswordEmail Component Integration', () => {
  let component: ForgotPasswordEmail;
  let fixture: ComponentFixture<ForgotPasswordEmail>;
  let httpMock: HttpTestingController;
  let alertService: AlertService;
  let router: Router;

  const baseUrl: string = `${environment.apiUrl}/auth`;

  const monitorMock: Partial<MonitorInactivity> = {
    inactivity$: {
      pipe: () => ({ subscribe: () => ({}) }),
    } as MonitorInactivity['inactivity$'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordEmail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
        provideRouter([]),
        provideStore({}),
        AuthService,
        AlertService,
        { provide: MonitorInactivity, useValue: monitorMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordEmail);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    alertService = TestBed.inject(AlertService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component with form', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(component.form.controls.email).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    component.form.controls.email.setValue('');
    component.submit();

    httpMock.expectNone(`${baseUrl}/forgot-password`);
  });

  it('should not submit with invalid email format', () => {
    component.form.controls.email.setValue('not-an-email');
    component.submit();

    httpMock.expectNone(`${baseUrl}/forgot-password`);
  });

  it('should submit and call success alert on valid email', () => {
    const successSpy = vi.spyOn(alertService, 'success');
    component.form.controls.email.setValue('john@test.com');
    component.submit();

    const req = httpMock.expectOne(`${baseUrl}/forgot-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'john@test.com' });

    const mockResponse: ForgotPasswordResponse = {
      challengeId: 'challenge-123',
      method: 'email',
      maskedPhone: '***-***-1234',
    };
    req.flush(mockResponse);

    expect(successSpy).toHaveBeenCalledWith(
      'Reset code sent to your email',
      expect.objectContaining({ variant: 'dismissible' }),
    );
  });

  it('should call error alert on 404 response', () => {
    const errorSpy = vi.spyOn(alertService, 'error');
    component.form.controls.email.setValue('unknown@test.com');
    component.submit();

    const req = httpMock.expectOne(`${baseUrl}/forgot-password`);
    req.flush(
      { message: 'User not found' },
      { status: 404, statusText: 'Not Found' },
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'User not found',
      expect.objectContaining({ variant: 'dismissible' }),
    );
  });

  it('should call error alert on 400 response', () => {
    const errorSpy = vi.spyOn(alertService, 'error');
    component.form.controls.email.setValue('bad@test.com');
    component.submit();

    const req = httpMock.expectOne(`${baseUrl}/forgot-password`);
    req.flush(
      { message: 'Invalid email format' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Invalid email format',
      expect.objectContaining({ variant: 'dismissible' }),
    );
  });

  it('should call warning alert on generic server error', () => {
    const warningSpy = vi.spyOn(alertService, 'warning');
    component.form.controls.email.setValue('john@test.com');
    component.submit();

    const req = httpMock.expectOne(`${baseUrl}/forgot-password`);
    req.flush(null, { status: 500, statusText: 'Server Error' });

    expect(warningSpy).toHaveBeenCalledWith(
      'Unable to send reset code. Please try again.',
      expect.objectContaining({ variant: 'dismissible' }),
    );
  });

  it('should clear alert before submitting', () => {
    const clearSpy = vi.spyOn(alertService, 'clearAlert');
    component.form.controls.email.setValue('john@test.com');
    component.submit();

    expect(clearSpy).toHaveBeenCalled();

    const req = httpMock.expectOne(`${baseUrl}/forgot-password`);
    req.flush({
      challengeId: 'c-1',
      method: 'email',
      maskedPhone: '***',
    });
  });

  it('should compute emailConfig with error when email is invalid', () => {
    component.form.controls.email.setValue('');
    component.form.controls.email.markAsTouched();
    fixture.detectChanges();

    const config = component.emailConfig();
    expect(config.errorMessage).toBeDefined();
  });

  it('should compute emailConfig without error when email is valid', () => {
    component.form.controls.email.setValue('valid@test.com');
    fixture.detectChanges();

    const config = component.emailConfig();
    expect(config.errorMessage).toBeUndefined();
  });
});
