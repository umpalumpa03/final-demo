import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ForgotPasswordVerify } from './forgot-password-verify';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { forgotPasswordSegments } from '../forgot-password.routes';

describe('ForgotPasswordVerify', () => {
  let component: ForgotPasswordVerify;
  let fixture: ComponentFixture<ForgotPasswordVerify>;
  const authServiceMock = {
    getChallengeId: () => 'challenge-id',
    verifyForgotPasswordOtp: vi.fn(() => of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordVerify],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(ForgotPasswordVerify);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to email step when missing challengeId', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    authServiceMock.getChallengeId = () => '';

    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith([
      '/auth',
      ...forgotPasswordSegments.base,
    ]);
  });

  it('should navigate to reset on success', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onSubmitResult({ statusCode: 200, message: 'Success' });

    expect(navigateSpy).toHaveBeenCalledWith([
      '/auth',
      ...forgotPasswordSegments.reset,
    ]);
  });

  it('should call verifyForgotPasswordOtp with code', () => {
    component.submitOtp('123456').subscribe();
    expect(authServiceMock.verifyForgotPasswordOtp).toHaveBeenCalledWith(
      '123456',
    );
  });
});
