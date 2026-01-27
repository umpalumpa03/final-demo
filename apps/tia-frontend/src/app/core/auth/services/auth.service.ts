import { inject, Injectable, signal } from '@angular/core';
import {
  ILoginRequest,
  ISignUpResponse,
  SendVerificationResponse,
} from '../models/authResponse.models';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { IloginResponse } from '../models/authRequests.model';
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

  public loginPostRequest(user: ILoginRequest): Observable<IloginResponse> {
    this.isLoginLoading.set(true);
    return this.http
      .post<IloginResponse>(`${environment.apiUrl}/auth/login`, user)
      .pipe(
        tap((res) => {
          if (res.status === 'mfa_required') {
            this.setChellangeId(res.challengId!);
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

  public setChellangeId(id: string) {
    this.challengeId = id;
  }

  public getChallengeId() {
    return this.challengeId;
  }

  public verifyMfa(code: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/mfa/verify`, {
      challengeId: this.challengeId,
      code,
    });
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
    const token = localStorage.getItem('signup_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<SendVerificationResponse>(
      `${environment.apiUrl}/auth/signup`,
      { phone: phoneNumber }, 
    { headers },
    );
  }
}
