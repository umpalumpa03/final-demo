import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OtpVerification } from './otp-verification';
import { AuthService } from '../../../services/auth.service';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;
  let authServiceMock: {
    verifyMfa: ReturnType<typeof vi.fn>;
    getChallengeId: ReturnType<typeof vi.fn>;
    isLoginLoading: ReturnType<typeof signal>;
  };

  beforeEach(async () => {
    authServiceMock = {
      verifyMfa: vi.fn().mockReturnValue(of({})),
      getChallengeId: vi.fn().mockReturnValue('challenge-123'),
      isLoginLoading: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [OtpVerification],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
