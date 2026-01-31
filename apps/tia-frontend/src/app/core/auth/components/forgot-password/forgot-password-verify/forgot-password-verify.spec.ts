import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';

import { ForgotPasswordVerify } from './forgot-password-verify';
import { AuthService } from '../../../services/auth.service';
import { forgotPasswordSegments } from '../forgot-password.routes';

describe('ForgotPasswordVerify', () => {
  let component: ForgotPasswordVerify;
  let fixture: ComponentFixture<ForgotPasswordVerify>;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      getChallengeId: vi.fn(() => 'challenge-id'),
      verifyForgotPasswordOtp: vi.fn(() => of({})),
      resendVerificationCode: vi.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordVerify],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(ForgotPasswordVerify);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to email step when challengeId is missing', () => {
    authServiceMock.getChallengeId.mockReturnValue('');

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith([
      '/auth',
      ...forgotPasswordSegments.base,
    ]);
  });

  it('should NOT redirect when challengeId exists', () => {
    authServiceMock.getChallengeId.mockReturnValue('challenge-id');

    component.ngOnInit();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call verifyForgotPasswordOtp when verifyResetOtp is triggered', () => {
    component.verifyResetOtp({ isCalled: true, otp: '123456' });

    expect(authServiceMock.verifyForgotPasswordOtp)
      .toHaveBeenCalledWith('123456');
  });

  it('should NOT call verifyForgotPasswordOtp when isCalled is false', () => {
    component.verifyResetOtp({ isCalled: false, code: '111' } as any);

    expect(authServiceMock.verifyForgotPasswordOtp)
      .not.toHaveBeenCalled();
  });

  it('should call resendVerificationCode when resendOtp is called with true', () => {
    component.resendOtp(true);

    expect(authServiceMock.resendVerificationCode)
      .toHaveBeenCalled();
  });

  it('should NOT call resendVerificationCode when resendOtp is false', () => {
    component.resendOtp(false);

    expect(authServiceMock.resendVerificationCode)
      .not.toHaveBeenCalled();
  });
});
