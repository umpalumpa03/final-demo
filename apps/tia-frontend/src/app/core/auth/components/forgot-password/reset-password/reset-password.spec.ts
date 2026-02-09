import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ResetPassword } from './reset-password';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let authServiceMock: { createNewPassword: ReturnType<typeof vi.fn> };
  let tokenServiceMock: { resetPasswordToken: string | null };
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      createNewPassword: vi.fn().mockReturnValue(of({})),
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('should create with correct default state', () => {
    expect(component).toBeTruthy();
    expect(component.title).toBe('auth.reset-password.title');
    expect(component.subtitle).toBe('auth.reset-password.subtitle');
    expect(component.buttonText).toBe('auth.reset-password.submit');
    expect(component.isSubmitting()).toBe(false);
    expect(component.alertState()).toBeNull();
  });

  it('ngOnInit should not navigate when resetPasswordToken exists', () => {
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('ngOnInit should redirect to OTP page when resetPasswordToken is missing', () => {
    tokenServiceMock.resetPasswordToken = null;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/auth', 'verify-otp-reset']);
  });

  it('submit should set isSubmitting, call API, navigate on success, and handle 400 and generic errors', () => {
    vi.useFakeTimers();

    const formValue = { password: 'Aa1!aaaa', confirmPassword: 'Aa1!aaaa' } as any;
    component.submit(formValue);
    vi.advanceTimersByTime(2000);

    expect(authServiceMock.createNewPassword).toHaveBeenCalledWith('Aa1!aaaa');
    expect(router.navigate).toHaveBeenCalledWith(['/auth', 'success']);
    expect(component.alertState()?.type).toBe('success');
    expect(component.alertState()?.title).toBe('Success!');
    expect(component.alertState()?.message).toBe('Password updated successfully');
    expect(component.isSubmitting()).toBe(false);

    authServiceMock.createNewPassword.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400 })),
    );
    component.submit(formValue);
    expect(component.alertState()?.type).toBe('error');
    expect(component.alertState()?.title).toBe('Oops!');
    expect(component.alertState()?.message).toBe('Unable to reset password. Please try again.');
    expect(component.isSubmitting()).toBe(false);

    authServiceMock.createNewPassword.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );
    component.submit(formValue);
    expect(component.alertState()?.type).toBe('warning');
    expect(component.alertState()?.title).toBe('Warning');
    expect(component.alertState()?.message).toBe('Something went wrong. Please try again.');

    vi.useRealTimers();
  });

  it('submit should clear previous alertState before calling API', () => {
    vi.useFakeTimers();

    component.alertState.set({ type: 'error', title: 'Oops!', message: 'Old error' });
    const formValue = { password: 'Aa1!aaaa', confirmPassword: 'Aa1!aaaa' } as any;
    component.submit(formValue);
    vi.advanceTimersByTime(2000);

    expect(component.alertState()?.type).toBe('success');

    vi.useRealTimers();
  });
});
