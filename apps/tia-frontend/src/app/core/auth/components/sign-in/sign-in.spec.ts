import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignIn } from './sign-in';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { vi } from 'vitest';

describe('SignIn', () => {
  let component: SignIn;
  let fixture: ComponentFixture<SignIn>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      loginPostRequest: vi.fn(() => of({ status: 'ok' } as any)),
      isLoginLoading: signal(false) as any,
    };

    await TestBed.configureTestingModule({
      imports: [SignIn],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignIn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as touched when invalid on submit', () => {
    vi.spyOn(component.loginForm, 'markAllAsTouched');
    component.loginForm.controls.username.setValue('');
    component.loginForm.controls.password.setValue('');

    component.submit();

    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call authService.loginPostRequest on valid submit', () => {
    component.loginForm.controls.username.setValue('user');
    component.loginForm.controls.password.setValue('pass');

    component.submit();

    expect(mockAuthService.loginPostRequest).toHaveBeenCalledWith({ username: 'user', password: 'pass' });
  });
});
