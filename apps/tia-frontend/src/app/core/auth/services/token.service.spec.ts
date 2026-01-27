import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TokenService } from './token.service';
import { TokenKey } from '../models/tokens.models';

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

  it('sets verify and signup tokens', () => {
    service.setVerifyToken('v');
    service.setSignUpToken('s');
    expect(localStorage.getItem(TokenKey.VERIFY)).toBe('v');
    expect(localStorage.getItem(TokenKey.SIGNUP)).toBe('s');
  });

  it('clears auth tokens (access & refresh)', () => {
    localStorage.setItem(TokenKey.ACCESS, 'a');
    localStorage.setItem(TokenKey.REFRESH, 'r');
    service.clearAuthToken();
    expect(localStorage.getItem(TokenKey.ACCESS)).toBeNull();
    expect(localStorage.getItem(TokenKey.REFRESH)).toBeNull();
  });

  it('clears refresh/verify token', () => {
    localStorage.setItem(TokenKey.VERIFY, 'v');
    service.clearRefreshToken();
    expect(localStorage.getItem(TokenKey.VERIFY)).toBeNull();
  });

  it('clears signup token', () => {
    localStorage.setItem(TokenKey.SIGNUP, 's');
    service.clearSignUpToken();
    expect(localStorage.getItem(TokenKey.SIGNUP)).toBeNull();
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
    localStorage.setItem(TokenKey.SIGNUP, 'v');

    expect(service.accessToken).toBe('a');
    expect(service.refreshToken).toBe('r');
    expect(service.verifyToken).toBe('v');
    expect(service.getSignUpToken).toBe('v');
  });
});
