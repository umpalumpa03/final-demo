import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import '@angular/compiler';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SignIn } from './sign-in';

setupTestBed();

describe('SignIn Component', () => {
  let fixture: ComponentFixture<SignIn>;
  let component: SignIn;

  const mockAuthService: any = {
    isLoginLoading: signal(false),
    errorMessage: signal(''),
    loginPostRequest: vi.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockAuthService.isLoginLoading.set(false);
    mockAuthService.errorMessage.set('');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SignIn],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SignIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes title and subtitle', () => {
    expect(component.title).toBe('Sign In');
    expect(component.subtitle).toContain('Enter your username');
  });

  it('initializes the form with empty values', () => {
    expect(component.loginForm.getRawValue()).toEqual({ username: '', password: '' });
  });

  it('does not call loginPostRequest if form is invalid', () => {
    component.loginForm.get('username')?.setValue('');
    component.loginForm.get('password')?.setValue('');

    component.submit();

    expect(mockAuthService.loginPostRequest).not.toHaveBeenCalled();
    expect(component.loginForm.touched).toBe(true);
  });

  it('calls loginPostRequest when form is valid', () => {
    const payload = { username: 'testuser', password: 'password123' };
    component.loginForm.setValue(payload as any);

    component.submit();

    expect(mockAuthService.loginPostRequest).toHaveBeenCalledWith(payload);
  });

  it('reacts to loading and error signals', () => {
    mockAuthService.isLoginLoading.set(true);
    mockAuthService.errorMessage.set('Invalid');
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
    expect(component.errorMessage()).toBe('Invalid');
  });
});