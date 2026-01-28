import { inject, Injectable, signal } from '@angular/core';
import {
  ILoginRequest,
  IMfaVerifyRequest,
  ISignUpResponse,
  OtpResponse,
  SendVerificationResponse,
  ForgotPasswordRequest,
  ForgotPasswordVerifyRequest,
  CreateNewPasswordRequest,
  ResendOtpRequest,
} from '../models/authRequest.models';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import {
  IloginResponse,
  IMfaVerifyResponse,
  ForgotPasswordResponse,
  ForgotPasswordVerifyResponse,
  CreateNewPasswordResponse,
  ResendOtpResponse,
} from '../models/authResponse.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { IRegistrationForm } from '../../../features/storybook/components/forms/models/contact-forms.model';

@Injectable()
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
            this.router.navigate(['/auth/phone-verify']);
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

  public setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }

  public getAccessToken(): string | null {
    return this.accessToken ?? localStorage.getItem('accessToken');
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

  public forgotPasswordRequest(
    email: string,
  ): Observable<ForgotPasswordResponse> {
    const payload: ForgotPasswordRequest = { email };
    return this.http
      .post<ForgotPasswordResponse>(
        `${environment.apiUrl}/auth/forgot-password`,
        payload,
      )
      .pipe(
        tap((res) =>
          this.tokenService.setForgotPasswordChallengeId(res.challengeId),
        ),
      );
  }

  public verifyForgotPasswordOtp(
    code: string,
  ): Observable<ForgotPasswordVerifyResponse> {
    const challengeId = this.tokenService.forgotPasswordChallengeId;
    if (!challengeId) {
      return throwError(() => new Error('Missing forgot password challengeId'));
    }

    const payload: ForgotPasswordVerifyRequest = { challengeId, code };
    return this.http
      .post<ForgotPasswordVerifyResponse>(
        `${environment.apiUrl}/auth/forgot-password/verify`,
        payload,
      )
      .pipe(
        tap((res) =>
          this.tokenService.setForgotPasswordAccessToken(res.access_token),
        ),
      );
  }

  public createNewPassword(
    password: string,
  ): Observable<CreateNewPasswordResponse> {
    const token = this.tokenService.forgotPasswordAccessToken;
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
    const challengeId = this.tokenService.forgotPasswordChallengeId;
    if (!challengeId) {
      return throwError(() => new Error('Missing forgot password challengeId'));
    }

    const payload: ResendOtpRequest = { challengeId };
    return this.http.post<ResendOtpResponse>(
      `${environment.apiUrl}/auth/mfa/otp-resend`,
      payload,
    );
  }

  public forgotPasswordAccessToken(): string | null {
    return this.tokenService.forgotPasswordAccessToken;
  }

  public clearForgotPasswordState(): void {
    this.tokenService.clearForgotPasswordAccessToken();
    this.tokenService.clearForgotPasswordChallengeId();
  }
}
