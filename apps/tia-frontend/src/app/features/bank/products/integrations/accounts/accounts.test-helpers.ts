import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  Account,
  AccountType,
} from '@tia/shared/models/accounts/accounts.model';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';
import { MockStore } from '@ngrx/store/testing';

export const mockAccount: Account = {
  id: 'acc-123',
  userId: 'user-1',
  permission: 1,
  type: AccountType.current,
  iban: 'GE89NB0000000123456789',
  friendlyName: 'Test Account',
  name: 'Test Account',
  status: 'active',
  balance: 1000,
  currency: 'USD',
  createdAt: '2026-01-01',
  openedAt: '2026-01-01',
  closedAt: '',
  isFavorite: false,
  isHidden: false,
};

export const mockAccount2: Account = {
  id: 'acc-456',
  userId: 'user-1',
  permission: 2,
  type: AccountType.saving,
  iban: 'GE89NB0000000456789012',
  friendlyName: 'Savings Account',
  name: 'Savings Account',
  status: 'active',
  balance: 5000,
  currency: 'GEL',
  createdAt: '2026-01-02',
  openedAt: '2026-01-02',
  closedAt: '',
  isFavorite: true,
  isHidden: false,
};

export const mockAccount3: Account = {
  id: 'acc-789',
  userId: 'user-1',
  permission: 32,
  type: AccountType.card,
  iban: 'GE89NB0000000789012345',
  friendlyName: 'Card Account',
  name: 'Card Account',
  status: 'active',
  balance: 2000,
  currency: 'USD',
  createdAt: '2026-01-03',
  openedAt: '2026-01-03',
  closedAt: '',
  isFavorite: false,
  isHidden: false,
};

export const mockAccounts: Account[] = [
  mockAccount,
  mockAccount2,
  mockAccount3,
];

export interface AccountsTestContext {
  httpMock: HttpTestingController;
  apiService: AccountsApiService;
  store?: MockStore;
}

export async function setupAccountsTest(): Promise<AccountsTestContext> {
  await TestBed.configureTestingModule({
    providers: [
      provideTranslateService(),
      provideHttpClient(),
      provideHttpClientTesting(),
      AccountsApiService,
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const apiService = TestBed.inject(AccountsApiService);

  return { httpMock, apiService };
}

export async function setupAccountsTestWithStore(): Promise<AccountsTestContext> {
  const { provideMockStore } = await import('@ngrx/store/testing');

  await TestBed.configureTestingModule({
    providers: [
      provideTranslateService(),
      provideHttpClient(),
      provideHttpClientTesting(),
      AccountsApiService,
      provideMockStore(),
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const apiService = TestBed.inject(AccountsApiService);
  const store = TestBed.inject(MockStore);

  return { httpMock, apiService, store };
}

export function cleanupAccountsTest(httpMock: HttpTestingController): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
