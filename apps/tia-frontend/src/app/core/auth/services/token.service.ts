import { Injectable } from '@angular/core';
import { TokenKey } from '../models/tokens.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  public setAccessToken(token: string): void {
    localStorage.setItem(TokenKey.ACCESS, token);
  }

  public setRefreshToken(token: string): void {
    localStorage.setItem(TokenKey.REFRESH, token);
  }

  public setVerifyToken(token: string): void {
    localStorage.setItem(TokenKey.VERIFY, token);
  }

  public setSignUpToken(token: string): void {
    localStorage.setItem(TokenKey.SIGNUP, token);
  }

  public setChallengeId(challengeId: string): void {
    localStorage.setItem(TokenKey.CHALLENGE, challengeId);
  }

  public clearAuthToken(): void {
    localStorage.removeItem(TokenKey.ACCESS);
    localStorage.removeItem(TokenKey.REFRESH);
  }

  public clearAccessToken(): void {
    localStorage.removeItem(TokenKey.ACCESS);
  }

  public clearRefreshToken(): void {
    localStorage.removeItem(TokenKey.REFRESH);
    localStorage.removeItem(TokenKey.VERIFY);
  }

  public clearVerifyToken(): void {
    localStorage.removeItem(TokenKey.VERIFY);
  }

  public clearSignUpToken(): void {
    localStorage.removeItem(TokenKey.SIGNUP);
  }

  public clearAllToken(): void {
    localStorage.clear();
  }

  public get accessToken() {
    return localStorage.getItem(TokenKey.ACCESS);
  }

  public get refreshToken() {
    return localStorage.getItem(TokenKey.REFRESH);
  }

  public get verifyToken() {
    return localStorage.getItem(TokenKey.VERIFY);
  }

  public get getSignUpToken(): string | null {
    return localStorage.getItem(TokenKey.SIGNUP);
  }

  public get challengeId(): string | null {
    return localStorage.getItem(TokenKey.CHALLENGE);
  }
}
