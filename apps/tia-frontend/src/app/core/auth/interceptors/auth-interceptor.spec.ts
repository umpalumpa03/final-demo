import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpRequest, HttpHandlerFn, HttpResponse, HttpEvent } from '@angular/common/http';
import { firstValueFrom, of, Observable } from 'rxjs';
import { authInterceptor } from '../services/auth-interceptor';
import { TokenService } from '../services/token.service';
import { PUBLIC_ENDPOINTS } from '../models/tokens.model';
import { TestBed } from '@angular/core/testing';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';

describe('authInterceptor', () => {
  let tokenServiceMock: { accessToken: string | null };
  let injector: EnvironmentInjector;

  beforeEach(() => {
    tokenServiceMock = { accessToken: 'mock-token' };

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: tokenServiceMock },
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

  it('does not add Authorization header for public endpoints', async () => {
    const publicUrl = PUBLIC_ENDPOINTS[0] || '/api/public';
    const req = new HttpRequest('GET', publicUrl);
    nextSpy.mockClear();

    await firstValueFrom(
      runInInjectionContext(injector, () => authInterceptor(req, nextSpy))
    );

    const calledReq = nextSpy.mock.calls[0][0];
    expect(calledReq.headers.has('Authorization')).toBe(false);
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
});