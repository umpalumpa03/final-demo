import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TokenService } from './token.service';
import { TokenKey } from '../models/tokens.model';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    service = new TokenService();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('sets access token', () => {
    service.setAccessToken('a');
    expect(localStorage.getItem(TokenKey.ACCESS)).toBe('a');
  });

  it('sets refresh token', () => {
    service.setRefreshToken('r');
    expect(localStorage.getItem(TokenKey.REFRESH)).toBe('r');
  });

  it('sets verify token', () => {
    service.setVerifyToken('v');
    expect(localStorage.getItem(TokenKey.VERIFY)).toBe('v');
  });

  it('sets signup token', () => {
    service.setSignUpToken('s');
    expect(localStorage.getItem(TokenKey.SIGNUP)).toBe('s');
  });

  it('sets challenge id', () => {
    expect(localStorage.getItem(TokenKey.CHALLENGE_ID)).toBe('c');
  });

  it('clears auth tokens (access & refresh)', () => {
    localStorage.setItem(TokenKey.ACCESS, 'a');
    localStorage.setItem(TokenKey.REFRESH, 'r');
    service.clearAuthToken();
    expect(localStorage.getItem(TokenKey.ACCESS)).toBeNull();
    expect(localStorage.getItem(TokenKey.REFRESH)).toBeNull();
  });

  it('clears refresh token', () => {
    localStorage.setItem(TokenKey.REFRESH, 'r');
    localStorage.setItem(TokenKey.VERIFY, 'v');
    service.clearRefreshToken();
    expect(localStorage.getItem(TokenKey.REFRESH)).toBeNull();
    expect(localStorage.getItem(TokenKey.VERIFY)).toBe('v');
  });

  it('clears verify token', () => {
    localStorage.setItem(TokenKey.VERIFY, 'v');
    service.clearVerifyToken();
    expect(localStorage.getItem(TokenKey.VERIFY)).toBeNull();
  });

  it('clears signup token', () => {
    localStorage.setItem(TokenKey.SIGNUP, 's');
    service.clearSignUpToken();
    expect(localStorage.getItem(TokenKey.SIGNUP)).toBeNull();
  });

  it('clears challenge id', () => {
    localStorage.setItem(TokenKey.CHALLENGE_ID, 'c');
    expect(localStorage.getItem(TokenKey.CHALLENGE_ID)).toBeNull();
  });

  it('clears all tokens', () => {
    localStorage.setItem(TokenKey.ACCESS, 'a');
    localStorage.setItem(TokenKey.VERIFY, 'v');
    localStorage.setItem(TokenKey.SIGNUP, 's');
    service.clearAllToken();
    expect(localStorage.getItem(TokenKey.ACCESS)).toBeNull();
    expect(localStorage.getItem(TokenKey.VERIFY)).toBeNull();
    expect(localStorage.getItem(TokenKey.SIGNUP)).toBeNull();
  });

  it('reads tokens via getters', () => {
    localStorage.setItem(TokenKey.ACCESS, 'a');
    localStorage.setItem(TokenKey.REFRESH, 'r');
    localStorage.setItem(TokenKey.VERIFY, 'v');
    localStorage.setItem(TokenKey.SIGNUP, 's');
    localStorage.setItem(TokenKey.CHALLENGE_ID, 'c');

    expect(service.accessToken).toBe('a');
    expect(service.refreshToken).toBe('r');
    expect(service.verifyToken).toBe('v');
    expect(service.getSignUpToken).toBe('s');
  });

  it('returns null for getters when tokens are not set', () => {
    expect(service.accessToken).toBeNull();
    expect(service.refreshToken).toBeNull();
    expect(service.verifyToken).toBeNull();
    expect(service.getSignUpToken).toBeNull();
  });
});
