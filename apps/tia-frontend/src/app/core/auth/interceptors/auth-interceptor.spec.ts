import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError, Subject } from 'rxjs';
import { Router } from '@angular/router';

import { authInterceptor } from './auth-interceptor';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { PUBLIC_ENDPOINTS } from '../models/tokens.model';

describe('authInterceptor (Vitest)', () => {
  let tokenService: {
    accessToken: string | null;
    refreshToken: string | null;
    setAccessToken: ReturnType<typeof vi.fn>;
    clearAuthToken: ReturnType<typeof vi.fn>;
  };

  let authService: {
    refreshTokenPostRequest: ReturnType<typeof vi.fn>;
  };

  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const createHandler =
    (response$: any): HttpHandlerFn =>
    (req) =>
      response$;

  beforeEach(() => {
    tokenService = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      setAccessToken: vi.fn(),
      clearAuthToken: vi.fn(),
    };

    authService = {
      refreshTokenPostRequest: vi.fn(),
    };

    router = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: tokenService },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('adds Authorization header for protected endpoints', () => {
    const req = new HttpRequest('GET', '/api/private');

    const next: HttpHandlerFn = (request) => {
      expect(request.headers.get('Authorization')).toBe('Bearer access-token');
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.runInInjectionContext(() => {
      return authInterceptor(req, next);
    });
  });

  it('does not add Authorization header when token is missing', () => {
    tokenService.accessToken = null;

    const req = new HttpRequest('GET', '/api/private');

    const next: HttpHandlerFn = (request) => {
      expect(request.headers.get('Authorization')).toBeNull();
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.runInInjectionContext(() => {
      return authInterceptor(req, next);
    });
  });

  it('does not refresh token for 401 on public endpoints', async () => {
    const req = new HttpRequest('GET', PUBLIC_ENDPOINTS[0]);

    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 401 }));

    try {
      await TestBed.runInInjectionContext(() =>
        firstValueFrom(authInterceptor(req, next)),
      );
    } catch (err) {
      expect((err as HttpErrorResponse).status).toBe(401);
      expect(tokenService.setAccessToken).not.toHaveBeenCalled();
    }
  });

  it('refreshes token and retries request on 401', async () => {
    const req = new HttpRequest('GET', '/api/private');

    authService.refreshTokenPostRequest.mockReturnValue(
      of({ access_token: 'new-access-token' }),
    );

    let callCount = 0;

    const next: HttpHandlerFn = (request) => {
      callCount++;

      if (callCount === 1) {
        return throwError(() => new HttpErrorResponse({ status: 401 }));
      }

      expect(request.headers.get('Authorization')).toBe(
        'Bearer new-access-token',
      );

      return of(new HttpResponse({ status: 200 }));
    };

    await TestBed.runInInjectionContext(() =>
      firstValueFrom(authInterceptor(req, next)),
    );

    expect(tokenService.setAccessToken).toHaveBeenCalledWith(
      'new-access-token',
    );
  });

  it('clears auth and redirects if refresh token is missing', async () => {
    tokenService.refreshToken = null;

    const req = new HttpRequest('GET', '/api/private');

    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 401 }));

    try {
      await TestBed.runInInjectionContext(() =>
        firstValueFrom(authInterceptor(req, next)),
      );
    } catch {
      expect(tokenService.clearAuthToken).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
    }
  });

  it('clears auth and redirects if refresh request fails', async () => {
    const req = new HttpRequest('GET', '/api/private');

    authService.refreshTokenPostRequest.mockReturnValue(
      throwError(() => new Error('refresh failed')),
    );

    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 401 }));

    try {
      await TestBed.runInInjectionContext(() =>
        firstValueFrom(authInterceptor(req, next)),
      );
    } catch {
      expect(tokenService.clearAuthToken).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
    }
  });

  it('queues requests during refresh and retries after refresh completes', async () => {
    const req1 = new HttpRequest('GET', '/api/private');
    const req2 = new HttpRequest('GET', '/api/private');

    const refresh$ = new Subject<any>();
    authService.refreshTokenPostRequest.mockReturnValue(refresh$);

    let callCount = 0;

    const next: HttpHandlerFn = (request) => {
      callCount++;

      if (callCount <= 2) {
        return throwError(() => new HttpErrorResponse({ status: 401 }));
      }

      expect(request.headers.get('Authorization')).toBe('Bearer new-token');
      return of(new HttpResponse({ status: 200 }));
    };

    const p1 = TestBed.runInInjectionContext(() =>
      firstValueFrom(authInterceptor(req1, next)),
    );

    const p2 = TestBed.runInInjectionContext(() =>
      firstValueFrom(authInterceptor(req2, next)),
    );

    // complete the refresh with a new token
    refresh$.next({ access_token: 'new-token' });
    refresh$.complete();

    await Promise.all([p1, p2]);

    expect(tokenService.setAccessToken).toHaveBeenCalledWith('new-token');
  });

  it('clears auth and redirects on 401 for refresh endpoint', async () => {
    const req = new HttpRequest('POST', '/auth/refresh', null);

    const next: HttpHandlerFn = () =>
      throwError(() => new HttpErrorResponse({ status: 401 }));

    try {
      await TestBed.runInInjectionContext(() =>
        firstValueFrom(authInterceptor(req, next)),
      );
    } catch {
      expect(tokenService.clearAuthToken).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
    }
  });
});
