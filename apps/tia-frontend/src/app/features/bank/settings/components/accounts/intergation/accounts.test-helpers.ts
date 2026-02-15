import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AccountsStore } from '../store/accounts.store';
import { AccountManagementService } from '../services/account-management.service';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { IAccounts } from '../models/account.models';
import { Store } from '@ngrx/store';
import { vi } from 'vitest';

export const mockAccounts: IAccounts[] = [
  {
    id: 'acc-1',
    type: 'CURRENT' as any,
    currency: 'GEL',
    iban: 'GE00TEST0000000001',
    name: 'Primary Account',
    balance: '1000',
    friendlyName: 'Primary',
    isHidden: false,
    order: null,
    isFavorite: false,
  },
  {
    id: 'acc-2',
    type: 'SAVING' as any,
    currency: 'USD',
    iban: 'GE00TEST0000000002',
    name: 'Savings Account',
    balance: '5000',
    friendlyName: 'Savings',
    isHidden: false,
    order: null,
    isFavorite: true,
  },
];

export interface TestContext {
  httpMock: HttpTestingController;
  store: InstanceType<typeof AccountsStore>;
  alertService: any;
  globalStore: any;
}

export async function setupAccountsTest(): Promise<TestContext> {
  const alertService = {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    clearAlert: vi.fn(),
  };

  const globalStore = {
    dispatch: vi.fn(),
  };

  await TestBed.configureTestingModule({
    providers: [
      provideTranslateService(),
      provideHttpClient(),
      provideHttpClientTesting(),
      AccountsStore,
      AccountManagementService,
      { provide: AlertService, useValue: alertService },
      { provide: Store, useValue: globalStore },
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const store = TestBed.inject(AccountsStore);

  return { httpMock, store, alertService, globalStore };
}

export function cleanupAccountsTest(httpMock: HttpTestingController): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
