import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordVerify } from './forgot-password-verify';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IVerified } from '../../../models/otp-verification.models';

describe('ForgotPasswordVerify Component', () => {
  let component: ForgotPasswordVerify;
  let fixture: ComponentFixture<ForgotPasswordVerify>;
  let authServiceMock: {
    getChallengeId: ReturnType<typeof vi.fn>;
    verifyForgotPasswordOtp: ReturnType<typeof vi.fn>;
    resendVerificationCode: ReturnType<typeof vi.fn>;
  };
  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      getChallengeId: vi.fn().mockReturnValue('challenge-123'),
      verifyForgotPasswordOtp: vi.fn().mockReturnValue(of({})),
      resendVerificationCode: vi.fn().mockReturnValue(of({})),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordVerify, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordVerify);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not navigate on init when challengeId exists', () => {
    authServiceMock.getChallengeId.mockReturnValue('challenge-123');
    
    component.ngOnInit();

    expect(authServiceMock.getChallengeId).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to base route when challengeId does not exist', () => {
    authServiceMock.getChallengeId.mockReturnValue(null);
    
    component.ngOnInit();

    expect(authServiceMock.getChallengeId).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth', 'forgot-password']);
  });

  it('should not verify OTP when isCalled is false', () => {
    const event: IVerified = {
      isCalled: false,
      otp: '123456',
    };

    component.verifyResetOtp(event);

    expect(authServiceMock.verifyForgotPasswordOtp).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should resend OTP when isCalled is true', () => {
    component.resendOtp(true);

    expect(authServiceMock.resendVerificationCode).toHaveBeenCalled();
  });

  it('should not resend OTP when isCalled is false', () => {
    component.resendOtp(false);

    expect(authServiceMock.resendVerificationCode).not.toHaveBeenCalled();
  });
});