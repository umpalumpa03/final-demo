import { Injectable } from '@angular/core';
import { TokenKey } from '../models/tokens.models';

@Injectable({providedIn: 'root'})
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

  public setChallengeId(code:string) {
    localStorage.setItem(TokenKey.CHALLENGE_ID, code)
  }

  public clearAuthToken(): void {
    localStorage.removeItem(TokenKey.ACCESS);
    localStorage.removeItem(TokenKey.REFRESH);
  }

  public clearRefreshToken(): void {
    localStorage.removeItem(TokenKey.VERIFY);
  }

  public clearSignUpToken(): void {
    localStorage.removeItem(TokenKey.SIGNUP)
  }

  public clearChallengeId(code:string) {
    localStorage.removeItem(TokenKey.CHALLENGE_ID)
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

  public get getChallengeId(): string | null {
    return localStorage.getItem(TokenKey.CHALLENGE_ID)
  }
  //reg - phone // @email
}
