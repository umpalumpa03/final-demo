import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { VerifySignup } from './verify-signup';
import { AuthService } from '../../../services/auth.service';

describe('VerifySignup', () => {
  let component: VerifySignup;
  let fixture: ComponentFixture<VerifySignup>;
  let authMock: any;

  beforeEach(async () => {
    authMock = { verifyPhoneOtpCode: vi.fn().mockReturnValue({ subscribe: () => {} }) };

    await TestBed.configureTestingModule({
      imports: [VerifySignup],
      providers: [{ provide: AuthService, useValue: authMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifySignup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submitOtp delegates to AuthService.verifyPhoneOtpCode', () => {
    expect(authMock.verifyPhoneOtpCode).toHaveBeenCalledWith('123456');
  });
});
