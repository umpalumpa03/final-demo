import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { TokenKey } from '../models/tokens.model';

describe('TokenService', () => {
  let service: TokenService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};

    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
    });

    TestBed.configureTestingModule({
      providers: [TokenService],
    });

    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setTokens', () => {
    it('should set access token', () => {
      service.setAccessToken('test-access-token');
      expect(localStorage.setItem).toHaveBeenCalledWith(TokenKey.ACCESS, 'test-access-token');
      expect(localStorageMock[TokenKey.ACCESS]).toBe('test-access-token');
    });

    it('should set refresh token', () => {
      service.setRefreshToken('test-refresh-token');
      expect(localStorage.setItem).toHaveBeenCalledWith(TokenKey.REFRESH, 'test-refresh-token');
      expect(localStorageMock[TokenKey.REFRESH]).toBe('test-refresh-token');
    });

    it('should set verify token', () => {
      service.setVerifyToken('test-verify-token');
      expect(localStorage.setItem).toHaveBeenCalledWith(TokenKey.VERIFY, 'test-verify-token');
      expect(localStorageMock[TokenKey.VERIFY]).toBe('test-verify-token');
    });

    it('should set signup token', () => {
      service.setSignUpToken('test-signup-token');
      expect(localStorage.setItem).toHaveBeenCalledWith(TokenKey.SIGNUP, 'test-signup-token');
      expect(localStorageMock[TokenKey.SIGNUP]).toBe('test-signup-token');
    });

    it('should set reset password token', () => {
      service.setResetPasswordToken('test-reset-password-token');
      expect(localStorage.setItem).toHaveBeenCalledWith(TokenKey.RESET_PASSWORD, 'test-reset-password-token');
      expect(localStorageMock[TokenKey.RESET_PASSWORD]).toBe('test-reset-password-token');
    });
  });

  describe('getTokens', () => {
    it('should get access token', () => {
      localStorageMock[TokenKey.ACCESS] = 'test-access-token';
      expect(service.accessToken).toBe('test-access-token');
      expect(localStorage.getItem).toHaveBeenCalledWith(TokenKey.ACCESS);
    });

    it('should get refresh token', () => {
      localStorageMock[TokenKey.REFRESH] = 'test-refresh-token';
      expect(service.refreshToken).toBe('test-refresh-token');
      expect(localStorage.getItem).toHaveBeenCalledWith(TokenKey.REFRESH);
    });

    it('should get verify token', () => {
      localStorageMock[TokenKey.VERIFY] = 'test-verify-token';
      expect(service.verifyToken).toBe('test-verify-token');
      expect(localStorage.getItem).toHaveBeenCalledWith(TokenKey.VERIFY);
    });

    it('should get signup token', () => {
      localStorageMock[TokenKey.SIGNUP] = 'test-signup-token';
      expect(service.getSignUpToken).toBe('test-signup-token');
      expect(localStorage.getItem).toHaveBeenCalledWith(TokenKey.SIGNUP);
    });

    it('should get reset password token', () => {
      localStorageMock[TokenKey.RESET_PASSWORD] = 'test-reset-password-token';
      expect(service.resetPasswordToken).toBe('test-reset-password-token');
      expect(localStorage.getItem).toHaveBeenCalledWith(TokenKey.RESET_PASSWORD);
    });

    it('should return null when token does not exist', () => {
      expect(service.accessToken).toBeNull();
      expect(service.refreshToken).toBeNull();
      expect(service.verifyToken).toBeNull();
      expect(service.getSignUpToken).toBeNull();
      expect(service.resetPasswordToken).toBeNull();
    });
  });

  describe('clearTokens', () => {
    it('should clear auth tokens (access and refresh)', () => {
      service.clearAuthToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.ACCESS);
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.REFRESH);
    });

    it('should clear refresh and verify tokens', () => {
      service.clearRefreshToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.REFRESH);
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.VERIFY);
    });

    it('should clear all tokens', () => {
      service.clearAllToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.ACCESS);
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.REFRESH);
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.VERIFY);
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.SIGNUP);
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.RESET_PASSWORD);
    });

    it('should clear access token only', () => {
      service.clearAccessToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.ACCESS);
    });

    it('should clear verify token only', () => {
      service.clearVerifyToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.VERIFY);
    });

    it('should clear signup token only', () => {
      service.clearSignUpToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.SIGNUP);
    });

    it('should clear reset password token only', () => {
      service.clearResetPasswordToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith(TokenKey.RESET_PASSWORD);
    });
  });

});