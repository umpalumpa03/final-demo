import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';

import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { MonitorInactivity } from '../../../services/monitor-inacticity.service';

import {
  ForgotPasswordResponse,
  ForgotPasswordVerifyResponse,
  CreateNewPasswordResponse,
} from '../../../models/authResponse.model';

export const mockForgotPasswordResponse: ForgotPasswordResponse = {
  challengeId: 'challenge-123',
  method: 'email',
  maskedPhone: '***-***-1234',
};

export const mockVerifyOtpResponse: ForgotPasswordVerifyResponse = {
  access_token: 'reset-token-abc',
};

export const mockCreatePasswordResponse: CreateNewPasswordResponse = {
  success: true,
};

export interface ForgotPasswordTestContext {
  readonly httpMock: HttpTestingController;
  readonly authService: AuthService;
  readonly tokenService: TokenService;
  readonly alertService: AlertService;
  readonly router: Router;
}

export async function setupForgotPasswordTest(): Promise<ForgotPasswordTestContext> {
  const monitorMock: Partial<MonitorInactivity> = {
    inactivity$: { pipe: () => ({ subscribe: () => ({}) }) } as MonitorInactivity['inactivity$'],
  };

  await TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideTranslateService(),
      provideRouter([]),
      provideStore({}),
      AuthService,
      TokenService,
      AlertService,
      { provide: MonitorInactivity, useValue: monitorMock },
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const authService = TestBed.inject(AuthService);
  const tokenService = TestBed.inject(TokenService);
  const alertService = TestBed.inject(AlertService);
  const router = TestBed.inject(Router);

  localStorage.clear();

  return { httpMock, authService, tokenService, alertService, router };
}

export function cleanupForgotPasswordTest(
  httpMock: HttpTestingController,
): void {
  try {
    httpMock.verify();
  } finally {
    localStorage.clear();
    TestBed.resetTestingModule();
  }
}
