import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PUBLIC_ENDPOINTS } from '../models/tokens.model';
import { TokenService } from './token.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<unknown>> => {
const tokenService = inject(TokenService);

  const accessToken = tokenService.accessToken;
  const isPublic = PUBLIC_ENDPOINTS.some(url => req.url.includes(url));

  if (isPublic || !accessToken) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(authReq);
  }
