import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SignUp } from './sign-up';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('SignUp (Vitest)', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;
  let authService: AuthService;
  let tokenService: TokenService;
  let navigateSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    const mockAuthService = {
      signUpUser: vi.fn(),
    };

    const mockTokenService = {
      setSignUpToken: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SignUp],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);

    const router = TestBed.inject(Router) as any;
    navigateSpy = vi.fn();
    router.navigate = navigateSpy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call signUpService and handle success', () => {
    const mockResponse = { signup_token: '12345' };
    authService.signUpUser = vi.fn().mockReturnValue(of(mockResponse));

    component.onSignUp({ email: 'test@example.com', password: 'password' } as any);

    expect(authService.signUpUser).toHaveBeenCalled();
    expect(component.loadingState()).toBe(false);
    expect(component.errorMessage()).toBe('');
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/sign-up/otp']);
  });

  it('should handle error with array message', () => {
    const error = { error: { message: ['email must be an email'] } };
    authService.signUpUser = vi.fn().mockReturnValue(throwError(() => error));

    component.onSignUp({ email: 'invalid', password: 'password' } as any);

    expect(component.errorMessage()).toBe('Invalid Email');
  });

  it('should handle error with string message', () => {
    const error = { error: { message: 'Some error occurred' } };
    authService.signUpUser = vi.fn().mockReturnValue(throwError(() => error));

    component.onSignUp({ email: 'test@example.com', password: 'password' } as any);

    expect(component.errorMessage()).toBe('Some error occurred');
  });

  it('should handle unexpected errors', () => {
    const error = { error: {} };
    authService.signUpUser = vi.fn().mockReturnValue(throwError(() => error));

    component.onSignUp({ email: 'test@example.com', password: 'password' } as any);

    expect(component.errorMessage()).toBe('An unexpected error occurred');
  });
});
