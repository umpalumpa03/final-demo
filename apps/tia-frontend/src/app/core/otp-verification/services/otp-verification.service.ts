import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OtpResponse,
  OtpSettingsConfiguration,
} from '../models/otp-verification.models';
import { TokenService } from '@tia/core/auth/services/token.service';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OtpVerificationService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  public getOtpConfig(): Observable<OtpSettingsConfiguration> {
    return this.http.get<OtpSettingsConfiguration>(
      `${environment.apiUrl}/settings/config`,
    );
  }

  public resendVerificationCode(challengeId: string): Observable<OtpResponse> {
    const token =
      this.tokenService.accessToken || this.tokenService.getSignUpToken;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<OtpResponse>(
      `${environment.apiUrl}/auth/mfa/otp-resend`,
      { challengeId },
      { headers },
    );
  }
}
