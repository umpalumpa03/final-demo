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
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Routes } from '../models/tokens.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { UserInfoActions } from '../../../store/user-info/user-info.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private challengeId!: string;
  public isLoginLoading = signal<boolean>(false);
  public errorMessage = signal<boolean | null>(false);
  public successMessage = signal<boolean | null>(false);
  public infoMessage = signal<boolean | null>(false);
  private baseUrl = `${environment.apiUrl}/auth`;

  public setChellangeId(id: string) {
    this.challengeId = id;
  }

  public getChallengeId() {
    return this.challengeId;
  }

  public loginPostRequest(user: ILoginRequest): Observable<IloginResponse> {
    this.isLoginLoading.set(true);
    this.tokenService.clearAllToken();
    return this.http.post<IloginResponse>(`${this.baseUrl}/login`, user).pipe(
      tap((res) => {
        if (res.status === 'mfa_required') {
          this.setChellangeId(res.challengeId!);
          this.router.navigate([Routes.OTP_SIGN_IN]);
        }

        if (res.status === 'phone_verification_required') {
          this.tokenService.setVerifyToken(res.verification_token!);
          this.router.navigate([Routes.PHONE]);
        }
      }),
      catchError((err) => {
        this.errorMessage.set(true);
        return throwError(() => err);
      }),
      finalize(() => this.isLoginLoading.set(false)),
    );
  }

  public refreshTokenPostRequest(
    refreshToken: IRefreshTokenRequest,
  ): Observable<IMfaVerifyResponse> {
    return this.http
      .post<IMfaVerifyResponse>(`${this.baseUrl}/refresh`, refreshToken)
      .pipe(
        tap((res) => {
          if (res.access_token && res.refresh_token) {
            this.tokenService.setAccessToken(res.access_token);
            this.tokenService.setRefreshToken(res.refresh_token);
          }
        }),
        catchError((err) => {
          this.errorMessage.set(true);
          return throwError(() => err);
        }),
      );
  }

  public logout(): Observable<ILogoutResponse> {
    return this.http.post<ILogoutResponse>(`${this.baseUrl}/logout`, {}).pipe(
      tap((res) => {
        if (res.success === true) {
          this.tokenService.clearAuthToken();
          this.tokenService.clearUserInfo();
          this.router.navigate([Routes.SIGN_IN]);
        }
      }),
    );
  }

  public verifyMfa(verify: IMfaVerifyRequest): Observable<IMfaVerifyResponse> {
    this.isLoginLoading.set(true);

    return this.http
      .post<IMfaVerifyResponse>(`${this.baseUrl}/mfa/verify`, verify)
      .pipe(
        tap((res) => {
          if (res.access_token && res.refresh_token) {
            this.tokenService.setAccessToken(res.access_token);
            this.tokenService.setRefreshToken(res.refresh_token);
            this.store.dispatch(UserInfoActions.loadUser());
            this.router.navigate([Routes.DASHBOARD]);
          }
        }),
        catchError((err) => {
          this.errorMessage.set(true);
          return throwError(() => err);
        }),
        finalize(() => this.isLoginLoading.set(false)),
      );
  }

  public signUpUser(userData: IRegistrationForm): Observable<ISignUpResponse> {
    return this.http.post<ISignUpResponse>(`${this.baseUrl}/signup`, userData);
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
      `${this.baseUrl}/phone`,
      { phone: phoneNumber },
      { headers },
    );
  }

  public verifyPhoneOtpCode(code: string): Observable<OtpResponse> {
    const token = this.tokenService.getSignUpToken;
    const challengeId = this.getChallengeId();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .post<OtpResponse>(
        `${this.baseUrl}/phone/verify`,
        { challengeId, code },
        { headers },
      )
      .pipe(
        tap(() => {
          this.tokenService.clearAuthToken();
          this.router.navigate([Routes.SIGN_IN]);
        }),
        catchError((err) => {
          this.errorMessage.set(true);
          this.isLoginLoading.set(false);
          return throwError(() => err);
        }),
        finalize(() => this.isLoginLoading.set(false)),
      );
  }

  public forgotPasswordRequest(
    email: string,
  ): Observable<ForgotPasswordResponse> {
    const payload: ForgotPasswordRequest = { email };
    return this.http
      .post<ForgotPasswordResponse>(`${this.baseUrl}/forgot-password`, payload)
      .pipe(
        tap((res) => {
          this.setChellangeId(res.challengeId);
        }),
      );
  }

  public verifyForgotPasswordOtp(
    code: string,
  ): Observable<ForgotPasswordVerifyResponse> {
    this.tokenService.clearAccessToken();
    console.log(this.getChallengeId());
    const payload: ForgotPasswordVerifyRequest = {
      challengeId: this.getChallengeId(),
      code,
    };
    return this.http
      .post<ForgotPasswordVerifyResponse>(
        `${this.baseUrl}/forgot-password/verify`,
        payload,
      )
      .pipe(
        tap((res) => {
          if (res.access_token) {
            this.tokenService.setAccessToken(res.access_token);
          }
        }),
      );
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
      `${this.baseUrl}/create-new-password`,
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
      `${this.baseUrl}/mfa/otp-resend`,
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
      `${this.baseUrl}/mfa/otp-resend`,
      { challengeId },
      { headers },
    );
  }
}
