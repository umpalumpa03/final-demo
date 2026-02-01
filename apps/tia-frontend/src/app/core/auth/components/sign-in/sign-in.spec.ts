import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignIn } from './sign-in';
import { AuthService } from '../../services/auth.service';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SignIn Component', () => {
  let component: SignIn;
  let fixture: ComponentFixture<SignIn>;
  let authServiceMock: {
    isLoginLoading: ReturnType<typeof signal>;
    errorMessage: ReturnType<typeof signal>;
    loginPostRequest: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Create mock AuthService
    authServiceMock = {
      isLoginLoading: signal(false),
      errorMessage: signal(''),
      loginPostRequest: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [SignIn, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([]),
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should have username field as required with minLength validator', () => {
    const usernameControl = component.loginForm.get('username');
    
    usernameControl?.setValue('');
    expect(usernameControl?.hasError('required')).toBe(true);
    
    usernameControl?.setValue('a');
    expect(usernameControl?.hasError('minlength')).toBe(true);
    
    usernameControl?.setValue('ab');
    expect(usernameControl?.valid).toBe(true);
  });

  it('should have password field as required', () => {
    const passwordControl = component.loginForm.get('password');
    
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBe(true);
    
    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.loginForm.patchValue({
      username: '',
      password: '',
    });

    component.submit();

    expect(authServiceMock.loginPostRequest).not.toHaveBeenCalled();
    expect(component.loginForm.touched).toBe(true);
  });

  it('should call authService.loginPostRequest when form is valid', () => {
    const formValue = {
      username: 'testuser',
      password: 'testpassword',
    };

    component.loginForm.patchValue(formValue);
    component.submit();

    expect(authServiceMock.loginPostRequest).toHaveBeenCalledWith(formValue);
    expect(authServiceMock.loginPostRequest).toHaveBeenCalledTimes(1);
  });
});