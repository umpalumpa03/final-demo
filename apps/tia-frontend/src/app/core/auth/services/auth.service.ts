import { inject, Injectable, signal } from '@angular/core';
import {
  ILoginRequest,
  IMfaVerifyRequest,
  IRefreshTokenRequest,
} from '../models/authRequest.models';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import {
  IloginResponse,
  ILogoutResponse,
  IMfaVerifyResponse,
  ISignUpResponse,
  OtpResponse,
  SendVerificationResponse,
} from '../models/authResponse.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { IRegistrationForm } from '../../../features/storybook/components/forms/models/contact-forms.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private accessToken!: string;
  private refreshToken!: string;
  private challengeId!: string;
  public isLoginLoading = signal<boolean>(false);
  public loginError = signal<string | null>(null);

  public setChellangeId(id: string) {
    this.challengeId = id;
  }

  public getChallengeId() {
    return this.challengeId;
  }

  public loginPostRequest(user: ILoginRequest): Observable<IloginResponse> {
    this.isLoginLoading.set(true);
    return this.http
      .post<IloginResponse>(`${environment.apiUrl}/auth/login`, user)
      .pipe(
        tap((res) => {
          if (res.status === 'mfa_required') {
            this.setChellangeId(res.challengeId!);
            this.router.navigate(['/auth/otp-verify']);
          } else if (res.status === 'phone_verification_required') {
            this.tokenService.setVerifyToken(res.verification_token!);
            this.router.navigate(['/auth/phone']);
          }
        }),
        catchError((err) => {
          this.loginError.set(err?.error?.message ?? 'Incorrect credentials');
          this.isLoginLoading.set(false);
          return throwError(() => err);
        }),
        finalize(() => this.isLoginLoading.set(false)),
      );
  }

  public isLoggedIn(): boolean {
    return this.tokenService.accessToken ? true : false;
  }

  public refreshTokenPostRequest(
    refreshToken: IRefreshTokenRequest,
  ): Observable<IMfaVerifyResponse> {
    return this.http
      .post<IMfaVerifyResponse>(`${environment.apiUrl}/aსuth/refresh`, refreshToken)
      .pipe(
        tap((res) => {
          if (res.access_token && res.refresh_token) {
            this.tokenService.setAccessToken(res.access_token);
            this.tokenService.setRefreshToken(res.refresh_token);
          }
        }),
      );
  }

  public logout(): Observable<ILogoutResponse> {
    return this.http
      .post<ILogoutResponse>(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        tap((res) => {
          if (res.success === true) {
            this.tokenService.clearAccessToken();
          }
        }),
      );
  }

  public verifyMfa(verify: IMfaVerifyRequest): Observable<IMfaVerifyResponse> {
    this.isLoginLoading.set(true);
    return this.http
      .post<IMfaVerifyResponse>(`${environment.apiUrl}/auth/mfa/verify`, verify)
      .pipe(
        tap((res) => {
          if (res.access_token && res.refresh_token) {
            this.tokenService.setAccessToken(res.access_token);
            this.tokenService.setRefreshToken(res.refresh_token);
            this.router.navigate(['/bank/dashboard']);
          }
        }),
      );
  }

  public signUpUser(userData: IRegistrationForm): Observable<ISignUpResponse> {
    return this.http.post<ISignUpResponse>(
      `${environment.apiUrl}/auth/signup`,
      userData,
    );
  }

  public sendVerificationCode(
    phoneNumber: string,
  ): Observable<SendVerificationResponse> {
    const token =
      this.tokenService.getSignUpToken || this.tokenService.verifyToken;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<SendVerificationResponse>(
      `${environment.apiUrl}/auth/phone`,
      { phone: phoneNumber },
      { headers },
    );
  }

  public verifyOtpCode(code: string): Observable<OtpResponse> {
    const token = this.tokenService.getSignUpToken;
    const challengeId = this.tokenService.getChallengeId;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<OtpResponse>(
      `${environment.apiUrl}/auth/phone/verify`,
      { challengeId, code },
      { headers },
    );
  }
}
