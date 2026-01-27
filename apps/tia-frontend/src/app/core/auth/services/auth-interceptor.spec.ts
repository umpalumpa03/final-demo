import { describe, it, expect } from 'vitest';
import { HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { of, firstValueFrom } from 'rxjs';
import { AuthInterceptor } from './auth-interceptor';
import { PUBLIC_ENDPOINTS } from '../models/tokens.model';

describe('AuthInterceptor', () => {
  it('adds Authorization header when token exists and endpoint is not public', async () => {
    const mockTokenService = { accessToken: 'token-123' } as any;
    const interceptor = new AuthInterceptor(mockTokenService);

    const req = new HttpRequest('GET', '/private');

    let handledReq: HttpRequest<any> | undefined;

    const handler: HttpHandler = {
      handle: (r: HttpRequest<any>) => {
        handledReq = r;
        return of(new HttpResponse({ status: 200 }));
      },
    };

    await firstValueFrom(interceptor.intercept(req, handler));

    expect(handledReq).toBeDefined();
    expect(handledReq!.headers.get('Authorization')).toBe(
      'Bearer token-123',
    );
  });
});
