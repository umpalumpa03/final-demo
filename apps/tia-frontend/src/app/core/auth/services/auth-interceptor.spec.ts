import { describe, it, expect } from 'vitest';
import { AuthInterceptor } from './auth-interceptor';
import { HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { of, firstValueFrom } from 'rxjs';

describe('AuthInterceptor', () => {
  it('sets Authorization header to Bearer ', async () => {
    const interceptor = new AuthInterceptor();

    const req = new HttpRequest('GET', '/test');

    let handledReq: HttpRequest<any> | undefined;
    const handler: HttpHandler = {
      handle: (r: HttpRequest<any>) => {
        handledReq = r;
        return of(new HttpResponse({ status: 200 }));
      },
    };

    await firstValueFrom(interceptor.intercept(req, handler));

    expect(handledReq).toBeDefined();
    expect(handledReq!.headers.get('Authorization')).toBe('Bearer ');
  });
});
