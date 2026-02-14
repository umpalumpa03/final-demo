import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { TransferStore } from '../store/transfers.store';
import { TransfersApiService } from '../services/transfersApi.service';
import { TransferRepeatService } from '../services/transfer-repeat.service';
import { TransferValidationService } from '../components/transfers-external/services/transfer-validation.service';
import { TransferUtilsService } from '../services/transfer-utils.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { selectPhoneNumber } from 'apps/tia-frontend/src/app/store/personal-info/personal-info.selectors';
import {
  selectAccounts,
  selectIsLoading,
  selectError,
  selectSelectedAccount,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { selectTransactionToRepeat } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { environment } from '../../../../../environments/environment';
import {
  RecipientAccount,
  RecipientResponse,
} from '../models/transfers.state.model';
import { ITransactions } from 'apps/tia-frontend/src/app/shared/models/transactions/transactions.models';

export const BASE_URL = `${environment.apiUrl}/transfers`;

export const mockSenderAccountGEL: Account = {
  id: 'sender-1',
  userId: 'user-1',
  permission: 2,
  friendlyName: 'My GEL Account',
  type: 'current' as any,
  currency: 'GEL',
  iban: 'GE00TIA0000000000001',
  name: 'Current GEL',
  status: 'active',
  balance: 5000,
  createdAt: '2024-01-01',
  openedAt: '2024-01-01',
  closedAt: '',
  isFavorite: true,
  isHidden: false,
};

export const mockSenderAccountUSD: Account = {
  id: 'sender-2',
  userId: 'user-1',
  permission: 4,
  friendlyName: 'My USD Account',
  type: 'current' as any,
  currency: 'USD',
  iban: 'GE00TIA0000000000002',
  name: 'Current USD',
  status: 'active',
  balance: 3000,
  createdAt: '2024-01-01',
  openedAt: '2024-01-01',
  closedAt: '',
  isFavorite: false,
  isHidden: false,
};

export const mockReceiverAccountGEL: Account = {
  id: 'receiver-1',
  userId: 'user-1',
  permission: 2,
  friendlyName: 'My Receiver GEL',
  type: 'current' as any,
  currency: 'GEL',
  iban: 'GE00TIA0000000000010',
  name: 'Receiver GEL',
  status: 'active',
  balance: 2000,
  createdAt: '2024-01-01',
  openedAt: '2024-01-01',
  closedAt: '',
  isFavorite: false,
  isHidden: false,
};

export const mockSenderAccountInternalGEL: Account = {
  id: 'sender-internal',
  userId: 'user-1',
  permission: 3,
  friendlyName: 'My Internal GEL',
  type: 'current' as any,
  currency: 'GEL',
  iban: 'GE00TIA0000000000001',
  name: 'Internal GEL',
  status: 'active',
  balance: 5000,
  createdAt: '2024-01-01',
  openedAt: '2024-01-01',
  closedAt: '',
  isFavorite: true,
  isHidden: false,
};

export const mockSenderAccountNoPermission: Account = {
  id: 'sender-no-perm',
  userId: 'user-1',
  permission: 0,
  friendlyName: 'No Permission',
  type: 'current' as any,
  currency: 'GEL',
  iban: 'GE00TIA0000000000003',
  name: 'No Permission',
  status: 'active',
  balance: 1000,
  createdAt: '2024-01-01',
  openedAt: '2024-01-01',
  closedAt: '',
  isFavorite: false,
  isHidden: false,
};

export const mockRecipientAccountGEL: RecipientAccount = {
  id: 'recipient-acc-1',
  iban: 'GE00TIA0000000000099',
  currency: 'GEL',
  name: 'Recipient GEL',
  balance: 2000,
};

export const mockRecipientResponseIban: RecipientResponse = {
  fullName: 'Nino Kapanadze',
  accounts: [mockRecipientAccountGEL],
};

export const mockInternalTransaction: ITransactions = {
  id: 'tx-int-1',
  userId: 'user-1',
  amount: 500,
  transactionType: 'debit',
  transferType: 'OwnAccountTransfer',
  currency: 'GEL',
  description: 'Own transfer',
  debitAccountNumber: 'GE00TIA0000000000001',
  creditAccountNumber: 'GE00TIA0000000000010',
  category: 'Transfer',
  meta: null,
  createdAt: '2024-06-01T10:00:00Z',
  updatedAt: '2024-06-01T10:00:00Z',
};

export const mockSameBankTransaction: ITransactions = {
  id: 'tx-same-1',
  userId: 'user-1',
  amount: 200,
  transactionType: 'debit',
  transferType: 'ToSomeoneSameBank',
  currency: 'GEL',
  description: 'Same bank transfer',
  debitAccountNumber: 'GE00TIA0000000000001',
  creditAccountNumber: 'GE00TIA0000000000099',
  category: 'Transfer',
  meta: null,
  createdAt: '2024-06-01T10:00:00Z',
  updatedAt: '2024-06-01T10:00:00Z',
};

export const mockExternalBankTransaction: ITransactions = {
  id: 'tx-ext-1',
  userId: 'user-1',
  amount: 300,
  transactionType: 'debit',
  transferType: 'ToSomeoneOtherBank',
  currency: 'GEL',
  description: 'External bank transfer',
  debitAccountNumber: 'GE00TIA0000000000001',
  creditAccountNumber: 'GE29BOG0000000000011',
  category: 'Transfer',
  meta: { recipientName: 'External Recipient' },
  createdAt: '2024-06-01T10:00:00Z',
  updatedAt: '2024-06-01T10:00:00Z',
};

export interface RepeatTestContext {
  httpMock: HttpTestingController;
  transferStore: InstanceType<typeof TransferStore>;
  ngrxStore: MockStore;
  repeatService: TransferRepeatService;
  router: Router;
}

export async function setupRepeatTest(
  accounts: Account[] = [
    mockSenderAccountGEL,
    mockSenderAccountUSD,
    mockReceiverAccountGEL,
  ],
): Promise<RepeatTestContext> {
  const mockBreakpoint = {
    isMobile: signal(false),
    isTablet: signal(false),
  };

  await TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot()],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      provideMockStore({
        selectors: [
          { selector: selectPhoneNumber, value: '555123456' },
          { selector: selectAccounts, value: accounts },
          { selector: selectIsLoading, value: false },
          { selector: selectError, value: null },
          { selector: selectSelectedAccount, value: null },
          { selector: selectTransactionToRepeat, value: null },
        ],
      }),
      TransferStore,
      TransfersApiService,
      TransferRepeatService,
      TransferValidationService,
      TransferUtilsService,
      { provide: BreakpointService, useValue: mockBreakpoint },
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const transferStore = TestBed.inject(TransferStore);
  const ngrxStore = TestBed.inject(MockStore);
  const repeatService = TestBed.inject(TransferRepeatService);
  const router = TestBed.inject(Router);

  return {
    httpMock,
    transferStore,
    ngrxStore,
    repeatService,
    router,
  };
}

export function cleanupRepeatTest(httpMock: HttpTestingController): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
