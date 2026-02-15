import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OtpVerificationService } from './otp-verification.service';
import { TokenService } from '@tia/core/auth/services/token.service';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

describe('OtpVerificationService', () => {
  let service: OtpVerificationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: TokenService,
          useValue: {
            accessToken: 'access-123',
            getSignUpToken: 'signup-xyz',
          },
        },
      ],
    });

    service = TestBed.inject(OtpVerificationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('getOtpConfig should call GET settings config', async () => {
    const mock = { otp: { maxResendAttempts: 1 } } as any;

    const obs = service.getOtpConfig();
    const resPromise = firstValueFrom(obs);

    const req = http.expectOne(`${environment.apiUrl}/settings/config`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    const res = await resPromise;
    expect(res).toEqual(mock);
  });

  it('resendVerificationCode should POST with access token when available', async () => {
    const mockResp = { ok: true } as any;

    const obs = service.resendVerificationCode('challenge-1');
    const resPromise = firstValueFrom(obs);

    const req = http.expectOne(`${environment.apiUrl}/auth/mfa/otp-resend`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ challengeId: 'challenge-1' });
    expect(req.request.headers.get('Authorization')).toBe('Bearer access-123');
    req.flush(mockResp);

    const res = await resPromise;
    expect(res).toEqual(mockResp);
  });

  it('resendVerificationCode should fallback to getSignUpToken when accessToken is missing', async () => {
    // replace TokenService with one that has no accessToken
    const token = TestBed.inject(TokenService) as any;
    token.accessToken = null;

    const mockResp = { ok: true } as any;

    const obs = service.resendVerificationCode('challenge-2');
    const resPromise = firstValueFrom(obs);

    const req = http.expectOne(`${environment.apiUrl}/auth/mfa/otp-resend`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer signup-xyz');
    req.flush(mockResp);

    const res = await resPromise;
    expect(res).toEqual(mockResp);
  });
});
