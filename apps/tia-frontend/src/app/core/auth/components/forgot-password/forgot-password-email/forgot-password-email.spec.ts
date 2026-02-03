import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPasswordEmail } from './forgot-password-email';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { Routes } from '../../../models/tokens.model';
import { signal } from '@angular/core';

describe('ForgotPasswordEmail', () => {
  let component: ForgotPasswordEmail;
  let fixture: ComponentFixture<ForgotPasswordEmail>;
  let authServiceMock: {
    forgotPasswordRequest: ReturnType<typeof vi.fn>;
    setChellangeId: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    const isLoadingSignal = signal(false);
    
    authServiceMock = {
      forgotPasswordRequest: vi
        .fn()
        .mockReturnValue(of({ challengeId: 'challenge-1' })),
      setChellangeId: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordEmail, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            forgotPasswordRequest: vi.fn().mockReturnValue(
              of({ challengeId: 'challenge-1' }),
            ),
            setChellangeId: vi.fn(),
            isLoginLoading: isLoadingSignal,
          },
        },
        {
          provide: TokenService,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordEmail);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('submit: validates form, calls API on valid input, navigates on success, and handles all error types', () => {
    // Invalid form - should not call API
    component.submit();
    expect(authServiceMock.forgotPasswordRequest).not.toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(false);

    // Valid form - should call API and navigate
    component.form.controls.email.setValue('user@test.com');
    component.submit();
    expect(authServiceMock.forgotPasswordRequest).toHaveBeenCalledWith(
      'user@test.com',
    );
    expect(authServiceMock.setChellangeId).toHaveBeenCalledWith('challenge-1');
    expect(router.navigate).toHaveBeenCalledWith([Routes.OTP_FORGOT_PASSWORD]);
    expect(component.submitError()).toBeNull();
    expect(component.isSubmitting()).toBe(false);

    // 404 error - should show "User not found"
    authServiceMock.forgotPasswordRequest.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
            error: { message: 'User not found' },
          }),
      ),
    );
    component.form.controls.email.setValue('notfound@test.com');
    component.submit();
    expect(component.submitError()).toBe('User not found');
    expect(component.isSubmitting()).toBe(false);

    // 400 error with array message - should use first item
    authServiceMock.forgotPasswordRequest.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { message: ['email must be an email'] },
          }),
      ),
    );
    component.form.controls.email.setValue('bad@test.com');
    component.submit();
    expect(component.submitError()).toBe('email must be an email');

    // 400 error with string message - should use message directly
    authServiceMock.forgotPasswordRequest.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { message: 'Invalid email' },
          }),
      ),
    );
    component.form.controls.email.setValue('another@test.com');
    component.submit();
    expect(component.submitError()).toBe('Invalid email');

    // Unknown error - should show generic message
    authServiceMock.forgotPasswordRequest.mockReturnValue(
      throwError(() => new Error('boom')),
    );
    component.form.controls.email.setValue('error@test.com');
    component.submit();
    expect(component.submitError()).toBe(
      'Unable to send reset code. Please try again.',
    );
    expect(component.isSubmitting()).toBe(false);
  });

  it('emailConfig: returns appropriate errorMessage based on form validation state', () => {
    // Empty email (required error)
    component.form.controls.email.setValue('');
    component.form.controls.email.markAsTouched();
    expect(component.emailConfig().errorMessage).toBe('Enter valid email');

    // Invalid email format (email error)
    component.form.controls.email.setValue('not-an-email');
    component.form.controls.email.markAsTouched();
    expect(component.emailConfig().errorMessage).toBe('Enter valid email');

    // Valid email (no error)
    component.form.controls.email.setValue('valid@email.com');
    expect(component.emailConfig().errorMessage).toBeUndefined();

    // Verify static config values

    expect(component.form.controls.email.hasError('required')).toBe(false);
    expect(component.form.controls.email.hasError('email')).toBe(true);
  });
});

describe('ForgotPasswordEmail emailConfig computed signal', () => {
  it('returns email error message for invalid email format', async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordEmail, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            forgotPasswordRequest: vi.fn().mockReturnValue(of({})),
            setChellangeId: vi.fn(),
            isLoginLoading: signal(false),
          },
        },
        {
          provide: TokenService,
          useValue: {},
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ForgotPasswordEmail);
    const component = fixture.componentInstance;

    // Set invalid email BEFORE first detectChanges so computed signal evaluates with this state
    component.form.controls.email.setValue('invalid-email');
    component.form.controls.email.markAsTouched();
    fixture.detectChanges();

    const config = component.emailConfig();
    expect(config.label).toBe('Email');
    expect(config.required).toBe(true);
    expect(config.placeholder).toBe('your.email@example.com');
  });
});
