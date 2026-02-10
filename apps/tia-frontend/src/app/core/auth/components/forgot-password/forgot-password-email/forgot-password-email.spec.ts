import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { ForgotPasswordEmail } from './forgot-password-email';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { Routes } from '../../../models/tokens.model';

describe('ForgotPasswordEmail', () => {
  let component: ForgotPasswordEmail;
  let fixture: ComponentFixture<ForgotPasswordEmail>;
  let authServiceMock: {
    forgotPasswordRequest: ReturnType<typeof vi.fn>;
    setChellangeId: ReturnType<typeof vi.fn>;
    isLoginLoading: ReturnType<typeof signal<boolean>>;
  };
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      forgotPasswordRequest: vi.fn().mockReturnValue(of({ challengeId: 'challenge-1' })),
      setChellangeId: vi.fn(),
      isLoginLoading: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordEmail, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordEmail);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('emailConfig should return error message for invalid email and undefined for valid', () => {
    component.form.controls.email.setValue('');
    component.form.controls.email.markAsTouched();
    expect(component.emailConfig().errorMessage).toBe('Enter valid email');

    component.form.controls.email.setValue('valid@email.com');
    expect(component.emailConfig().errorMessage).toBeUndefined();
  });

  it('submit should skip when form invalid, call API on valid input, navigate on success, and handle errors', () => {
    vi.useFakeTimers();

    component.submit();
    expect(authServiceMock.forgotPasswordRequest).not.toHaveBeenCalled();

    component.form.controls.email.setValue('user@test.com');
    component.submit();
    vi.advanceTimersByTime(2000);

    expect(authServiceMock.forgotPasswordRequest).toHaveBeenCalledWith('user@test.com');
    expect(authServiceMock.setChellangeId).toHaveBeenCalledWith('challenge-1');
    expect(router.navigate).toHaveBeenCalledWith([Routes.OTP_FORGOT_PASSWORD]);
    expect(component.alertState()?.type).toBe('success');

    authServiceMock.forgotPasswordRequest.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, error: { message: 'User not found' } })),
    );
    component.form.controls.email.setValue('notfound@test.com');
    component.submit();
    expect(component.alertState()?.message).toBe('User not found');

    authServiceMock.forgotPasswordRequest.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { message: ['email must be an email'] } })),
    );
    component.form.controls.email.setValue('bad@test.com');
    component.submit();
    expect(component.alertState()?.message).toBe('email must be an email');

    vi.useRealTimers();
  });
});
