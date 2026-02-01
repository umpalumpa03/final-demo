import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPasswordEmail } from './forgot-password-email';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { Routes } from '../../../models/tokens.model';

describe('ForgotPasswordEmail', () => {
  let component: ForgotPasswordEmail;
  let fixture: ComponentFixture<ForgotPasswordEmail>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
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
    expect(authService.setChellangeId).toHaveBeenCalledWith('challenge-1');
    expect(router.navigate).toHaveBeenCalledWith([Routes.OTP_FORGOT_PASSWORD]);
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

  it('shows required error when email is empty', () => {
    component.form.controls.email.setValue('');
    component.form.controls.email.markAsTouched();

    expect(component.form.controls.email.hasError('required')).toBe(true);
  });

  it('shows invalid email error when email format is wrong', () => {
    component.form.controls.email.setValue('invalid-email');
    component.form.controls.email.markAsTouched();

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

    expect(config.errorMessage).toBe('Enter a valid email');
  });
});
