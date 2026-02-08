import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignIn } from './sign-in';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('SignIn', () => {
  let fixture: ComponentFixture<SignIn>;
  let component: SignIn;
  let authMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authMock = {
      loginPostRequest: vi.fn().mockReturnValue(of({})),
      errorMessage: signal(false),
      isLoginLoading: signal(false),
    };

    routerMock = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [SignIn, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: {}, params: of({}), queryParams: of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('computes errorMessage and updates alertTypes', () => {
    authMock.errorMessage.set(true);
    fixture.detectChanges();

    expect(component.errorMessage()).toBe(true);
    expect(component.alertTypes.error.message).toBe('Incorrect Credentials');
  });

  it('does not submit when form invalid', () => {
    const spy = vi.spyOn(authMock, 'loginPostRequest');
    component.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('submits when form is valid', () => {
    component.loginForm.controls.username.setValue('ab');
    component.loginForm.controls.password.setValue('secret');

    component.submit();

    expect(authMock.loginPostRequest).toHaveBeenCalledWith(
      {
        username: 'ab',
        password: 'secret',
      },
    );
  });

  it('navigateToSignUp respects isRouteLoading', async () => {
    const ev = { preventDefault: vi.fn() } as unknown as Event;

    component.isRouteLoading.set(true);
    component.navigateToSignUp(ev);
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();

    component.isRouteLoading.set(false);
    await component.navigateToSignUp(ev);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(component.signUpRoute);
  });
});