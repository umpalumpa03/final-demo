import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap } from 'rxjs';
import { PUBLIC_ENDPOINTS } from '../models/tokens.model';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Subject, filter, take, throwError } from 'rxjs';
import { IRefreshTokenRequest } from '../models/authRequest.models';
import { Router } from '@angular/router';

let refreshInProgress = false;
const refreshSubject = new Subject<string | null>();

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = tokenService.accessToken;
  const isPublic = PUBLIC_ENDPOINTS.some((url) => req.url.includes(url));

  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status !== 401) {
        return throwError(() => err);
      }

      if (isPublic) {
        return throwError(() => err);
      }

      const refreshToken = tokenService.refreshToken;
      if (!refreshToken) {
        tokenService.clearAuthToken();
        router.navigate(['/auth/sign-in']);
        return throwError(() => err);
      }

      if (!refreshInProgress) {
        refreshInProgress = true;
        refreshSubject.next(null);

        return authService
          .refreshTokenPostRequest({
            refresh_token: refreshToken,
          } as IRefreshTokenRequest)
          .pipe(
            switchMap((res) => {
              const newToken = res.access_token ?? tokenService.accessToken;
              tokenService.setAccessToken(newToken);
              refreshInProgress = false;
              refreshSubject.next(newToken);

              return next(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` },
                }),
              );
            }),
            catchError((err) => {
              refreshInProgress = false;
              refreshSubject.next(null);
              tokenService.clearAuthToken();
              router.navigate(['/auth/sign-in']);

              return throwError(() => err);
            }),
          );
      }

      return refreshSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) =>
          next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })),
        ),
      );
    }),
  );
};
