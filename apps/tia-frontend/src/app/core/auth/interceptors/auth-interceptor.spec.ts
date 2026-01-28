import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpResponse,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { firstValueFrom, of, Observable, throwError } from 'rxjs';
import { authInterceptor } from './auth-interceptor';
import { TokenService } from '../services/token.service';
import { PUBLIC_ENDPOINTS } from '../models/tokens.model';
import { TestBed } from '@angular/core/testing';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('authInterceptor', () => {
  let tokenServiceMock: {
    accessToken: string | null;
    refreshToken?: string | null;
    clearAuthToken?: ReturnType<typeof vi.fn>;
    setAccessToken?: ReturnType<typeof vi.fn>;
  };
  let authServiceMock: { refreshTokenPostRequest: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let injector: EnvironmentInjector;

  beforeEach(() => {
    tokenServiceMock = {
      accessToken: 'mock-token',
      refreshToken: null,
      clearAuthToken: vi.fn(),
      setAccessToken: vi.fn(),
    };
    authServiceMock = { refreshTokenPostRequest: vi.fn() };
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    // Get the injector from the TestBed
    injector = TestBed.inject(EnvironmentInjector);
  });

  // Correctly type the mock handler to return an Observable
  const next: HttpHandlerFn = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
    return of(new HttpResponse({ status: 200 }));
  };

  const nextSpy = vi.fn(next);

  it('adds Authorization header if token exists and endpoint is private', async () => {
    const req = new HttpRequest('GET', '/api/private');

    await firstValueFrom(
      runInInjectionContext(injector, () => authInterceptor(req, nextSpy))
    );

    const calledReq = nextSpy.mock.calls[0][0];
    expect(calledReq.headers.get('Authorization')).toBe('Bearer mock-token');
  });

  it('adds Authorization header for public endpoints when token exists', async () => {
    const publicUrl = PUBLIC_ENDPOINTS[0] || '/api/public';
    const req = new HttpRequest('GET', publicUrl);
    nextSpy.mockClear();

    await firstValueFrom(
      runInInjectionContext(injector, () => authInterceptor(req, nextSpy))
    );

    const calledReq = nextSpy.mock.calls[0][0];
    expect(calledReq.headers.get('Authorization')).toBe('Bearer mock-token');
  });

  it('does not add Authorization header if token is null', async () => {
    tokenServiceMock.accessToken = null;
    const req = new HttpRequest('GET', '/api/private');
    nextSpy.mockClear();

    await firstValueFrom(
      runInInjectionContext(injector, () => authInterceptor(req, nextSpy))
    );

    const calledReq = nextSpy.mock.calls[0][0];
    expect(calledReq.headers.has('Authorization')).toBe(false);
  });

  it('clears tokens and redirects when 401 and no refresh token', async () => {
    const req = new HttpRequest('GET', '/api/private');
    const errorNext: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 401 }));
    const errorSpy = vi.fn(errorNext);
    nextSpy.mockClear();

    await expect(
      firstValueFrom(
        runInInjectionContext(injector, () => authInterceptor(req, errorSpy)),
      ),
    ).rejects.toBeTruthy();

    expect(tokenServiceMock.clearAuthToken).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });

  it('refreshes token and retries request on 401', async () => {
    const req = new HttpRequest('GET', '/api/private');
    tokenServiceMock.refreshToken = 'refresh-123';
    authServiceMock.refreshTokenPostRequest.mockReturnValue(
      of({ access_token: 'new-token' }),
    );

    const refreshNext: HttpHandlerFn = (request: HttpRequest<any>) => {
      const authHeader = request.headers.get('Authorization');
      if (authHeader === 'Bearer new-token') {
        return of(new HttpResponse({ status: 200 }));
      }
      return throwError(() => new HttpErrorResponse({ status: 401 }));
    };
    const refreshSpy = vi.fn(refreshNext);

    await firstValueFrom(
      runInInjectionContext(injector, () => authInterceptor(req, refreshSpy)),
    );

    expect(authServiceMock.refreshTokenPostRequest).toHaveBeenCalledWith({
      refresh_token: 'refresh-123',
    });
    expect(tokenServiceMock.setAccessToken).toHaveBeenCalledWith('new-token');
    const retriedReq = refreshSpy.mock.calls[1][0];
    expect(retriedReq.headers.get('Authorization')).toBe('Bearer new-token');
  });

  it('does not attempt refresh for public endpoints on 401', async () => {
    const publicUrl = PUBLIC_ENDPOINTS[0] || '/api/public';
    const req = new HttpRequest('GET', publicUrl);
    const errorNext: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 401 }));
    const errorSpy = vi.fn(errorNext);
    tokenServiceMock.refreshToken = 'refresh-123';
    authServiceMock.refreshTokenPostRequest.mockClear();

    await expect(
      firstValueFrom(
        runInInjectionContext(injector, () => authInterceptor(req, errorSpy)),
      ),
    ).rejects.toBeTruthy();

    expect(authServiceMock.refreshTokenPostRequest).not.toHaveBeenCalled();
  });
});