import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ForgotPasswordEmail } from './forgot-password-email';
import { AuthService } from '../../../../services/auth.service';
import { TokenService } from '../../../../services/token.service';

describe('ForgotPasswordEmail', () => {
  let component: ForgotPasswordEmail;
  let fixture: ComponentFixture<ForgotPasswordEmail>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordEmail],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            forgotPasswordRequest: vi.fn().mockReturnValue(of({})),
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
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('does not submit when form is invalid', async () => {
    const requestSpy = vi.spyOn(authService, 'forgotPasswordRequest');

    await component.submit();

    expect(requestSpy).not.toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(false);
  });

  it('submits email and navigates on success', async () => {
    component.form.controls.email.setValue('user@test.com');

    await component.submit();

    expect(authService.forgotPasswordRequest).toHaveBeenCalledWith(
      'user@test.com',
    );
    expect(router.navigate).toHaveBeenCalledWith(['/auth/otp-verify']);
    expect(component.submitError()).toBeNull();
  });

  it('sets error message when request fails', async () => {
    vi.spyOn(authService, 'forgotPasswordRequest').mockReturnValue(
      throwError(() => new Error('fail')),
    );

    component.form.controls.email.setValue('user@test.com');
    await component.submit();

    expect(component.submitError()).toBe(
      'Unable to send reset code. Please try again.',
    );
    expect(component.isSubmitting()).toBe(false);
  });
});
