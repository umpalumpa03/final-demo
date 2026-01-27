import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PUBLIC_ENDPOINTS } from '../models/tokens.model';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(TokenService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const publicEndpoints = PUBLIC_ENDPOINTS;
    const access_token = this.authService.accessToken;
    const isPublic = publicEndpoints.some((url) => req.url.includes(url));

    if (isPublic || !access_token) {
      return next.handle(req);
    }

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${access_token}` },
    });
    return next.handle(authReq);
  }
}
