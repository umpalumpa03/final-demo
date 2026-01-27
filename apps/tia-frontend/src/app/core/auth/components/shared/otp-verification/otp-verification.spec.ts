import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { OtpVerification } from './otp-verification';
import { AuthService } from '../../../services/auth.service';
import { ForgotPasswordService } from '../../../services/forgot-password.service';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpVerification, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ otpContext: 'sign-in' }),
            queryParamMap: of(convertToParamMap({})),
            snapshot: { queryParamMap: convertToParamMap({}) },
          },
        },
        {
          provide: AuthService,
          useValue: {
            getChallengeId: () => 'challenge',
            verifyMfa: () => of({}),
            setTokens: vi.fn(),
          },
        },
        {
          provide: ForgotPasswordService,
          useValue: {
            email: () => '',
            challengeId: () => '',
            verifyOtp: () => of({ access_token: 'token' }),
            resendOtp: () => of({}),
            setAccessToken: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
