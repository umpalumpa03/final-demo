import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TokenService } from './token.service';
import { TokenKey } from '../models/tokens.model';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService]
    });
    service = TestBed.inject(TokenService);
    
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'removeItem');
    vi.spyOn(Storage.prototype, 'clear');
    
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should set access token in localStorage', () => {
    service.setAccessToken('test-access-token');
    expect(localStorage.setItem).toHaveBeenCalledWith(TokenKey.ACCESS, 'test-access-token');
  });

  it('should set refresh token in localStorage', () => {
    service.setRefreshToken('test-refresh-token');
    expect(localStorage.setItem).toHaveBeenCalledWith(TokenKey.REFRESH, 'test-refresh-token');
  });

  it('should set verify token in localStorage', () => {
    service.setVerifyToken('test-verify-token');
    expect(localStorage.setItem).toHaveBeenCalledWith(TokenKey.VERIFY, 'test-verify-token');
  });

  it('should set signup token in localStorage', () => {
    service.setSignUpToken('test-signup-token');
    expect(localStorage.setItem).toHaveBeenCalledWith(TokenKey.SIGNUP, 'test-signup-token');
  });

  it('should clear auth tokens (access and refresh)', () => {
    service.clearAuthToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.ACCESS);
    expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.REFRESH);
  });

  it('should clear only access token', () => {
    service.clearAccessToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.ACCESS);
  });

  it('should clear refresh and verify tokens', () => {
    service.clearRefreshToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.REFRESH);
    expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.VERIFY);
  });

  it('should clear verify token', () => {
    service.clearVerifyToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.VERIFY);
  });

  it('should clear signup token', () => {
    service.clearSignUpToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.SIGNUP);
  });

  it('should get access token from localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('stored-access-token');
    const result = service.accessToken;
    expect(localStorage.getItem).toHaveBeenCalledWith(TokenKey.ACCESS);
    expect(result).toBe('stored-access-token');
  });

  it('should get refresh token from localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('stored-refresh-token');
    const result = service.refreshToken;
    expect(localStorage.getItem).toHaveBeenCalledWith(TokenKey.REFRESH);
    expect(result).toBe('stored-refresh-token');
  });

  it('should get verify token from localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('stored-verify-token');
    const result = service.verifyToken;
    expect(localStorage.getItem).toHaveBeenCalledWith(TokenKey.VERIFY);
    expect(result).toBe('stored-verify-token');
  });

  it('should get signup token from localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('stored-signup-token');
    const result = service.getSignUpToken;
    expect(localStorage.getItem).toHaveBeenCalledWith(TokenKey.SIGNUP);
    expect(result).toBe('stored-signup-token');
  });
});