import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SignUp } from './sign-up';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';
import { of, throwError } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
 
describe('SignUp', () => {
  let component: SignUp;
  
  const validForm: IRegistrationForm = {
    email: 'test@example.com',
    password: 'Password123',
    username: 'testuser',
    firstName: 'Test'
  };
 
  const authServiceMock = {
    signUpUser: vi.fn()
  };
 
  const tokenServiceMock = {
    setSignUpToken: vi.fn()
  };
 
  const routerMock = {
    navigate: vi.fn()
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
 
  it('should initialize loadingState to false', () => {
    component.ngOnInit();
    expect(component.loadingState()).toBe(false);
  });
 
  it('should handle successful signup and navigation', () => {
    const mockResponse = { signup_token: 'token_abc_123' };
    authServiceMock.signUpUser.mockReturnValue(of(mockResponse));
 
    component.onSignUp(validForm);
 
    expect(tokenServiceMock.setSignUpToken).toHaveBeenCalledWith('token_abc_123');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/phone']);
    expect(component.errorMessage()).toBe('');
    expect(component.loadingState()).toBe(false);
  });
 
  it('should map "email must be an email" error array', () => {
    const errorResponse = {
      error: { message: ['email must be an email'] }
    };
    authServiceMock.signUpUser.mockReturnValue(throwError(() => errorResponse));
 
    component.onSignUp(validForm);
 
    expect(component.errorMessage()).toBe('Invalid Email');
  });
 
  it('should map first element of general error array', () => {
    const errorResponse = {
      error: { message: ['User already exists', 'Extra error'] }
    };
    authServiceMock.signUpUser.mockReturnValue(throwError(() => errorResponse));
 
    component.onSignUp(validForm);
 
    expect(component.errorMessage()).toBe('User already exists');
  });
 
  it('should handle string error messages', () => {
    const errorResponse = {
      error: { message: 'Database Connection Error' }
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
    authServiceMock.signUpUser.mockReturnValue(throwError(() => new Error('Generic Error')));
 
    component.onSignUp(validForm);
 
    expect(component.loadingState()).toBe(false);
  });
});