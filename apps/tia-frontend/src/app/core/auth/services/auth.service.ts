import {
  ILoginRequest,
  IMfaVerifyRequest,
  OtpResponse,
  SendVerificationResponse,
  ForgotPasswordRequest,
  ForgotPasswordVerifyRequest,
  CreateNewPasswordRequest,
  ResendOtpRequest,
  IRefreshTokenRequest,
} from '../models/authRequest.models';
import {
  CreateNewPasswordResponse,
  ForgotPasswordResponse,
  ForgotPasswordVerifyResponse,
  IloginResponse,
  ILogoutResponse,
  IMfaVerifyResponse,
  ISignUpResponse,
  ResendOtpResponse,
} from '../models/authResponse.model';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { IRegistrationForm } from '../../../features/storybook/components/forms/models/contact-forms.model';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private accessToken!: string;
  private refreshToken!: string;
  private challengeId!: string;
  public isLoginLoading = signal<boolean>(false);
  public errorMessage = signal<boolean | null>(false);
  public successMessage = signal<boolean | null>(false);
  public infoMessage = signal<boolean | null>(false);

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
            this.successMessage.set(true);
            this.router.navigate(['/auth/otp-verify']);
          } else if (res.status === 'phone_verification_required') {
            this.tokenService.setVerifyToken(res.verification_token!);
            this.infoMessage.set(true);
            this.router.navigate(['/auth/phone'], {
              state: { from: 'sign-in' },
            });
          }
        }),
        catchError((err) => {
          this.errorMessage.set(true);
          this.isLoginLoading.set(false);
          return throwError(() => err);
        }),
        finalize(() => this.isLoginLoading.set(false)),
      );
  }

  public refreshTokenPostRequest(
    refreshToken: IRefreshTokenRequest,
  ): Observable<IMfaVerifyResponse> {
    return this.http
      .post<IMfaVerifyResponse>(
        `${environment.apiUrl}/auth/refresh`,
        refreshToken,
      )
      .pipe(
        tap((res) => {
          if (res.access_token && res.refresh_token) {
            this.tokenService.setAccessToken(res.access_token);
            this.tokenService.setRefreshToken(res.refresh_token);
            this.isLoginLoading.set(true);
          }
        }),
        catchError((err) => {
          this.errorMessage.set(true);
          this.isLoginLoading.set(false);
          return throwError(() => err);
        }),
        finalize(() => this.isLoginLoading.set(false)),
      );
  }

  public logout(): Observable<ILogoutResponse> {
    return this.http
      .post<ILogoutResponse>(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        tap((res) => {
          if (res.success === true) {
            this.tokenService.clearAccessToken();
            this.router.navigate(['auth/sign-in']);
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
            this.isLoginLoading.set(true);
            this.router.navigate(['/bank/dashboards']);
          }
        }),
        catchError((err) => {
          this.errorMessage.set(true);
          this.isLoginLoading.set(false);
          return throwError(() => err);
        }),
        finalize(() => this.isLoginLoading.set(false)),
      );
  }

  public signUpUser(userData: IRegistrationForm): Observable<ISignUpResponse> {
    return this.http.post<ISignUpResponse>(
      `${environment.apiUrl}/auth/signup`,
      userData,
    );
  }

  public sendPhoneVerificationCode(
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
    const challengeId = this.getChallengeId();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<OtpResponse>(
      `${environment.apiUrl}/auth/phone/verify`,
      { challengeId, code },
      { headers },
    );
  }

  public forgotPasswordRequest(
    email: string,
  ): Observable<ForgotPasswordResponse> {
    const payload: ForgotPasswordRequest = { email };
    return this.http
      .post<ForgotPasswordResponse>(
        `${environment.apiUrl}/auth/forgot-password`,
        payload,
      )
      .pipe(tap((res) => this.setChellangeId(res.challengeId)));
  }

  public verifyForgotPasswordOtp(
    code: string,
  ): Observable<ForgotPasswordVerifyResponse> {
    this.tokenService.clearAccessToken();
    const payload: ForgotPasswordVerifyRequest = {
      challengeId: this.getChallengeId(),
      code,
    };
    return this.http
      .post<ForgotPasswordVerifyResponse>(
        `${environment.apiUrl}/auth/forgot-password/verify`,
        payload,
      )
      .pipe(tap((res) => this.tokenService.setAccessToken(res.access_token)));
  }

  public createNewPassword(
    password: string,
  ): Observable<CreateNewPasswordResponse> {
    const token = this.tokenService.accessToken;
    if (!token) {
      return throwError(
        () => new Error('Missing forgot password access token'),
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const payload: CreateNewPasswordRequest = { password };
    return this.http.post<CreateNewPasswordResponse>(
      `${environment.apiUrl}/auth/create-new-password`,
      payload,
      { headers },
    );
  }

  public resetPhoneOtp(): Observable<ResendOtpResponse> {
    const challengeId = this.getChallengeId();
    if (!challengeId) {
      return throwError(() => new Error('Missing forgot password challengeId'));
    }

    const payload: ResendOtpRequest = { challengeId };
    return this.http.post<ResendOtpResponse>(
      `${environment.apiUrl}/auth/mfa/otp-resend`,
      payload,
    );
  }

  public resendVerificationCode(): Observable<OtpResponse> {
    const challengeId = this.getChallengeId();
    const token = this.tokenService.getSignUpToken;

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
