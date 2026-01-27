import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';

interface ForgotPasswordResponse {
  challengeId: string;
  method: string;
  maskedPhone: string;
}

interface VerifyOtpResponse {
  access_token: string;
}

interface SuccessResponse {
  success: boolean;
}

@Injectable({ providedIn: 'root' })
export class ForgotPasswordService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiUrl;

  private readonly state = signal({
    email: '',
    challengeId: '',
    accessToken: '',
  });

  readonly email = computed(() => this.state().email);
  readonly challengeId = computed(() => this.state().challengeId);
  readonly accessToken = computed(() => this.state().accessToken);

  requestPasswordReset(email: string) {
    return this.http.post<ForgotPasswordResponse>(
      `${this.apiBaseUrl}/auth/forgot-password`,
      { email },
    );
  }

  setResetChallenge(email: string, challengeId: string) {
    this.state.update((current) => ({
      ...current,
      email,
      challengeId,
    }));
  }

  verifyOtp(code: string) {
    return this.http.post<VerifyOtpResponse>(
      `${this.apiBaseUrl}/auth/mfa/verify`,
      { challengeId: this.challengeId(), code },
      { headers: this.buildAuthHeaders(this.challengeId()) },
    );
  }

  setAccessToken(accessToken: string) {
    this.state.update((current) => ({
      ...current,
      accessToken,
    }));
  }

  resendOtp() {
    return this.http.post<SuccessResponse>(
      `${this.apiBaseUrl}/auth/mfa/otp-resend`,
      {},
      { headers: this.buildAuthHeaders(this.challengeId()) },
    );
  }

  resetPhoneOtp() {
    return this.http.post<SuccessResponse>(
      `${this.apiBaseUrl}/auth/phone/otp-reset`,
      { challengeId: this.challengeId() },
      { headers: this.buildAuthHeaders(this.challengeId()) },
    );
  }

  createNewPassword(password: string) {
    return this.http.post<SuccessResponse>(
      `${this.apiBaseUrl}/auth/create-new-password`,
      { password },
      { headers: this.buildAuthHeaders(this.accessToken()) },
    );
  }

  clearState() {
    this.state.set({
      email: '',
      challengeId: '',
      accessToken: '',
    });
  }

  private buildAuthHeaders(token: string) {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
