import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ResetPassword } from './reset-password';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { AlertService } from '@tia/core/services/alert/alert.service';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let authServiceMock: { createNewPassword: ReturnType<typeof vi.fn> };
  let alertServiceMock: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    warning: ReturnType<typeof vi.fn>;
    clearAlert: ReturnType<typeof vi.fn>;
  };
  let tokenServiceMock: { resetPasswordToken: string | null };
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      createNewPassword: vi.fn().mockReturnValue(of({})),
    };
    alertServiceMock = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      clearAlert: vi.fn(),
    };
    tokenServiceMock = {
      resetPasswordToken: 'forgot-token',
    };

    await TestBed.configureTestingModule({
      imports: [ResetPassword, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('ngOnInit should redirect to OTP page when resetPasswordToken is missing', () => {
    tokenServiceMock.resetPasswordToken = null;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/auth', 'verify-otp-reset']);
  });

  it('submit should call API, navigate on success, and handle 400 and generic errors', () => {
    vi.useFakeTimers();

    const formValue = { password: 'Aa1!aaaa', confirmPassword: 'Aa1!aaaa' } as any;
    component.submit(formValue);
    vi.advanceTimersByTime(2000);

    expect(authServiceMock.createNewPassword).toHaveBeenCalledWith('Aa1!aaaa');
    expect(router.navigate).toHaveBeenCalledWith(['/auth', 'success']);
    expect(alertServiceMock.success).toHaveBeenCalledWith(
      'auth.reset-password.alerts.passwordUpdated',
      { variant: 'dismissible', title: 'auth.reset-password.alerts.successTitle' },
    );
    expect(component.isSubmitting()).toBe(false);

    authServiceMock.createNewPassword.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400 })),
    );
    component.submit(formValue);
    expect(alertServiceMock.error).toHaveBeenCalledWith(
      'auth.reset-password.alerts.unableToReset',
      { variant: 'dismissible', title: 'auth.reset-password.alerts.errorTitle' },
    );

    authServiceMock.createNewPassword.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );
    component.submit(formValue);
    expect(alertServiceMock.warning).toHaveBeenCalledWith(
      'auth.reset-password.alerts.somethingWentWrong',
      { variant: 'dismissible', title: 'auth.reset-password.alerts.warningTitle' },
    );

    vi.useRealTimers();
  });
});
