import { TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { VerifySignin } from './verify-signin';
import { AuthService } from '../../../services/auth.service';

describe('VerifySignin', () => {
const createMockObservable = () => ({ subscribe: () => ({ unsubscribe: () => {} }) });
const mockTranslate = {
  instant: () => '',
  get: () => createMockObservable(),
  stream: () => createMockObservable(),
  currentLang: 'en',
  onLangChange: createMockObservable(),
  onTranslationChange: createMockObservable(),
  onDefaultLangChange: createMockObservable(),
};
  let component: VerifySignin;
  let authMock: any;

  beforeEach(async () => {
    authMock = {
      verifyMfa: vi.fn().mockReturnValue(of({ success: true })),
      getChallengeId: vi.fn().mockReturnValue('challenge-123'),
    };

    await TestBed.configureTestingModule({
      imports: [VerifySignin],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: ActivatedRoute, useValue: {} },
        { provide: TranslateService, useValue: mockTranslate },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(VerifySignin);
    component = fixture.componentInstance;
  });

  it('submitOtp should call authService.getChallengeId and verifyMfa with correct payload', () => {
    const code = '123456';

    component.verifyOtp({ isCalled: true, otp: code });

    expect(authMock.getChallengeId).toHaveBeenCalled();
    expect(authMock.verifyMfa).toHaveBeenCalledWith({
      code,
      challengeId: 'challenge-123',
    });
  });

  it('submitOtp should return the observable and resolve to expected value', async () => {
    const code = '654321';
  });
    it('resendOtp should call authService.resendVerificationCode when isCalled is true', () => {
      authMock.resendVerificationCode = vi.fn().mockReturnValue({ subscribe: vi.fn() });
      component.resendOtp(true);
      expect(authMock.resendVerificationCode).toHaveBeenCalled();
    });

    it('resendOtp should NOT call authService.resendVerificationCode when isCalled is false', () => {
      authMock.resendVerificationCode = vi.fn();
      component.resendOtp(false);
      expect(authMock.resendVerificationCode).not.toHaveBeenCalled();
    });
});
