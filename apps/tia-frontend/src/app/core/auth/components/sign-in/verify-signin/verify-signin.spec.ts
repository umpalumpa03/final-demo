import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { VerifySignin } from './verify-signin';
import { AuthService } from '../../../services/auth.service';

describe('VerifySignin', () => {
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
});
