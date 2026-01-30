import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, lastValueFrom } from 'rxjs';

import { VerifySignin } from './verify-signin';
import { AuthService } from '../../../services/auth.service';

describe('VerifySignin', () => {
  let fixture: ComponentFixture<VerifySignin>;
  let component: VerifySignin;
  let authMock: any;

  beforeEach(async () => {
    authMock = {
      verifyMfa: vi.fn().mockReturnValue(of({ success: true })),
      getChallengeId: vi.fn().mockReturnValue('challenge-123'),
    };

    await TestBed.configureTestingModule({
      imports: [VerifySignin],
      providers: [{ provide: AuthService, useValue: authMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifySignin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with default values', () => {
    expect(component).toBeTruthy();
    expect(component.title).toBe('OTP Verification');
    expect(component.subText).toContain("We've sent a 6-digit code");
    expect(component.submitBtnName).toBe('Verify');
    expect(component.isLoading).toBe(false);
  });

  it('submitOtp should call authService.getChallengeId and verifyMfa with correct payload', () => {
    const code = '123456';

    const returned = component.submitOtp(code);

    expect(authMock.getChallengeId).toHaveBeenCalled();
    expect(authMock.verifyMfa).toHaveBeenCalledWith({
      code,
      challengeId: 'challenge-123',
    });
    // ensure the returned value is the Observable from the mock
    expect(returned).toBeDefined();
  });

  it('submitOtp should return the observable and resolve to expected value', async () => {
    const code = '654321';
    const result = await lastValueFrom(component.submitOtp(code));
    expect(result).toEqual({ success: true });
  });
});
