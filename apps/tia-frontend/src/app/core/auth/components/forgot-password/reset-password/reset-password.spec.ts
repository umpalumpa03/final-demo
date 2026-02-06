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
  let tokenServiceMock: { accessToken: string | null };
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      createNewPassword: vi.fn().mockReturnValue(of({})),
    };

    tokenServiceMock = {
      accessToken: 'forgot-token',
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

  it('Feature: redirects to OTP page when accessToken is missing', () => {
    tokenServiceMock.accessToken = null;

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/auth', 'verify-otp-reset']);
  });

  it('Feature: submit calls API and navigates to success route on success', () => {
    const formValue = { password: 'Aa1!aaaa', confirmPassword: 'Aa1!aaaa' } as any;

    component.submit(formValue);

    expect(authServiceMock.createNewPassword).toHaveBeenCalledWith('Aa1!aaaa');
    expect(router.navigate).toHaveBeenCalledWith(['/auth', 'success']);
    expect(component.submitError()).toBeNull();
    expect(component.isSubmitting()).toBe(false);
  });

  it('Feature: submit sets reset-specific error message when API responds 400', () => {
    authServiceMock.createNewPassword.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400 })),
    );

    const formValue = { password: 'Aa1!aaaa', confirmPassword: 'Aa1!aaaa' } as any;

    component.submit(formValue);

    expect(component.submitError()).toBe('Unable to reset password. Please try again.');
    expect(component.isSubmitting()).toBe(false);
  });
});
