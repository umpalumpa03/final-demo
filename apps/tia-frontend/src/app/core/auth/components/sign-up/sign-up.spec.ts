import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { SignUp } from './sign-up';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signal } from '@angular/core';

describe('SignUp component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: TokenService, useValue: {} },
        { provide: Router, useValue: {} },
      ],
    });
  });

  it('onSignUp success sets token and navigates', () => {
    let tokenSet: any = null;
    let navigated = false;
    const authMock: Partial<AuthService> = {
      signUpUser: (_: IRegistrationForm) =>
        of({
          id: '1',
          email: 'a@b.com',
          username: 'u',
          createdAt: new Date().toISOString(),
          signup_token: 'token123',
        }),
      isLoginLoading: { set: (v: boolean) => {} } as any,
    };

    const tokenMock: Partial<TokenService> = {
      setSignUpToken: (t: any) => (tokenSet = t),
    };

    const routerMock: Partial<Router> = {
      navigate: (args: any) => (navigated = true) as any,
    } as any;

    TestBed.overrideProvider(AuthService as any, { useValue: authMock });
    TestBed.overrideProvider(TokenService as any, { useValue: tokenMock });
    TestBed.overrideProvider(Router as any, { useValue: routerMock });

    const instance = TestBed.runInInjectionContext(() => new SignUp());

    instance.onSignUp({} as any);

    expect(tokenSet).toBe('token123');
    expect(navigated).toBeTruthy();
  });

  it('onSignUp handles invalid email error', () => {
    const authMock: Partial<AuthService> = {
      signUpUser: () =>
        throwError(() => ({ error: { message: ['email must be an email'] } })),
      isLoginLoading: { set: (v: boolean) => {} } as any,
    };

    TestBed.overrideProvider(AuthService as any, { useValue: authMock });
    TestBed.overrideProvider(TokenService as any, { useValue: {} });
    TestBed.overrideProvider(Router as any, { useValue: {} });

    const instance = TestBed.runInInjectionContext(() => new SignUp());

    instance.onSignUp({} as any);

    expect(instance.errorMessage()).toBe('Invalid Email');
  });
});

describe('SignUp', () => {
  let component: SignUp;

  const validForm: IRegistrationForm = {
    email: 'test@example.com',
    password: 'Password123',
    username: 'testuser',
    firstName: 'Test',
  };

  const authServiceMock = {
    signUpUser: vi.fn(),
    isLoginLoading: signal(false),
    isUsernameAvailable: vi.fn(),
    isEmailAvailable: vi.fn(),
  };

  const tokenServiceMock = {
    setSignUpToken: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      providers: [
        SignUp,
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    component = TestBed.inject(SignUp);
  });

  it('should initialize loadingState to false', () => {});

  it('should handle successful signup and navigation', () => {
    const mockResponse = {
      id: '2',
      email: 't@e.com',
      username: 'testuser',
      createdAt: new Date().toISOString(),
      signup_token: 'token_abc_123',
    };
    authServiceMock.signUpUser.mockReturnValue(of(mockResponse));

    component.onSignUp(validForm);

    expect(tokenServiceMock.setSignUpToken).toHaveBeenCalledWith(
      'token_abc_123',
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/phone']);
    expect(component.errorMessage()).toBe('');
  });

  it('should map "email must be an email" error array', () => {
    const errorResponse = {
      error: { message: ['email must be an email'] },
    };
    authServiceMock.signUpUser.mockReturnValue(throwError(() => errorResponse));

    component.onSignUp(validForm);

    expect(component.errorMessage()).toBe('Invalid Email');
  });

  it('should map first element of general error array', () => {
    const errorResponse = {
      error: { message: ['User already exists', 'Extra error'] },
    };
    authServiceMock.signUpUser.mockReturnValue(throwError(() => errorResponse));

    component.onSignUp(validForm);

    expect(component.errorMessage()).toBe('User already exists');
  });

  it('should handle string error messages', () => {
    const errorResponse = {
      error: { message: 'Database Connection Error' },
    };
    authServiceMock.signUpUser.mockReturnValue(throwError(() => errorResponse));

    component.onSignUp(validForm);

    expect(component.errorMessage()).toBe('Database Connection Error');
  });

  it('should handle unknown error objects', () => {
    const errorResponse = { error: { message: null } };
    authServiceMock.signUpUser.mockReturnValue(throwError(() => errorResponse));

    component.onSignUp(validForm);

    expect(component.errorMessage()).toBe('An unexpected error occurred');
  });

  it('should stop loading on error', () => {
    authServiceMock.signUpUser.mockReturnValue(
      throwError(() => new Error('Generic Error')),
    );

    component.onSignUp(validForm);
  });

  it('constructor streams set availability and ignores short/invalid input', async () => {
    vi.useFakeTimers();

    authServiceMock.isUsernameAvailable.mockReturnValue(of({ available: true }));
    authServiceMock.isEmailAvailable.mockReturnValue(of({ available: false }));

    component.handleCurrentUsername('ab');
    expect(component.usernameAvailability()).toBeNull();

    component.handleCurrentUsername('abcd');
    component.handleCurrentEmail('a@b.com');

    vi.advanceTimersByTime(300);
    await Promise.resolve();

    expect(component.usernameAvailability()).toBeTruthy();
    expect(component.emailAvailability()).toBeFalsy();

    component.handleCurrentEmail('invalid');
    expect(component.currentEmail()).toBeNull();

    vi.useRealTimers();
  });
});
