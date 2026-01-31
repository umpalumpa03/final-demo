import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

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
  });

  it('submitOtp should call authService.getChallengeId and verifyMfa with correct payload', () => {
    const code = '123456';


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
