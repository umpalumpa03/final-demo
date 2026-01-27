import { describe, it, expect } from 'vitest';
import { HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  it('adds Authorization header when token exists and endpoint is not public', async () => {
    let handledReq: HttpRequest<any> | undefined;

    expect(handledReq).toBeDefined();
    expect(handledReq!.headers.get('Authorization')).toBe(
      'Bearer token-123',
    );
  });
});
