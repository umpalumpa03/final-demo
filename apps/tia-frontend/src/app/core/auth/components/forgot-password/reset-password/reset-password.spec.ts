import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { ResetPassword } from './reset-password';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            createNewPassword: vi.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: TokenService,
          useValue: {
            accessToken: 'forgot-token',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('submits and navigates on success', async () => {
    const formValue = { password: 'Aa1!aaaa', confirmPassword: 'Aa1!aaaa' } as any;

    component.submit(formValue);

    expect(authService.createNewPassword).toHaveBeenCalledWith('Aa1!aaaa');
    expect(router.navigate).toHaveBeenCalledWith([
      '/auth',
      'forgot-password',
      'success',
    ]);
    expect(component.submitError()).toBeNull();
    expect(component.isSubmitting()).toBe(false);
  });

  it('sets error on 400 response', async () => {
    vi.spyOn(authService, 'createNewPassword').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400 })),
    );

    const formValue = { password: 'Aa1!aaaa', confirmPassword: 'Aa1!aaaa' } as any;

    component.submit(formValue);

    expect(component.submitError()).toBe(
      'Unable to reset password. Please try again.',
    );
    expect(component.isSubmitting()).toBe(false);
  });
});
