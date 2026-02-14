import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { TransferRecipientService } from '../services/transfer-recipient.service';
import { TransferAccountSelectionService } from '../services/transfer-account-selection.service';
import { TransferAmountService } from '../services/transfer-amount.service';
import { TransferExecutionService } from '../services/transfer-execution.service';
import { TransferValidationService } from '../services/transfer-validation.service';
import { TransferUtilsService } from '../../../services/transfer-utils.service';
import { AlertService } from 'apps/tia-frontend/src/app/core/services/alert/alert.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { selectPhoneNumber } from 'apps/tia-frontend/src/app/store/personal-info/personal-info.selectors';
import {
  selectAccounts,
  selectIsLoading,
  selectError,
  selectSelectedAccount,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { environment } from '../../../../../../../environments/environment';
import {
  RecipientAccount,
  RecipientResponse,
} from '../../../models/transfers.state.model';

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

export const mockSenderAccountNoPermission: Account = {
  id: 'sender-3',
  userId: 'user-1',
  permission: 1,
  friendlyName: 'No Permission Account',
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

export const mockRecipientAccountUSD: RecipientAccount = {
  id: 'recipient-acc-2',
  iban: 'GE00TIA0000000000098',
  currency: 'USD',
  name: 'Recipient USD',
  balance: 1500,
};

export const mockRecipientResponsePhone: RecipientResponse = {
  fullName: 'Giorgi Beridze',
  accounts: [mockRecipientAccountGEL],
};

export const mockRecipientResponseIban: RecipientResponse = {
  fullName: 'Nino Kapanadze',
  accounts: [mockRecipientAccountGEL, mockRecipientAccountUSD],
};

export interface TransferTestContext {
  httpMock: HttpTestingController;
  transferStore: InstanceType<typeof TransferStore>;
  ngrxStore: MockStore;
  alertService: AlertService;
  recipientService: TransferRecipientService;
  accountSelectionService: TransferAccountSelectionService;
  amountService: TransferAmountService;
  executionService: TransferExecutionService;
  validationService: TransferValidationService;
}

export async function setupTransferTest(): Promise<TransferTestContext> {
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
          {
            selector: selectAccounts,
            value: [mockSenderAccountGEL, mockSenderAccountUSD],
          },
          { selector: selectIsLoading, value: false },
          { selector: selectError, value: null },
          { selector: selectSelectedAccount, value: null },
        ],
      }),
      TransferStore,
      TransfersApiService,
      TransferRecipientService,
      TransferAccountSelectionService,
      TransferAmountService,
      TransferExecutionService,
      TransferValidationService,
      TransferUtilsService,
      { provide: BreakpointService, useValue: mockBreakpoint },
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const transferStore = TestBed.inject(TransferStore);
  const ngrxStore = TestBed.inject(MockStore);
  const alertService = TestBed.inject(AlertService);
  const recipientService = TestBed.inject(TransferRecipientService);
  const accountSelectionService = TestBed.inject(
    TransferAccountSelectionService,
  );
  const amountService = TestBed.inject(TransferAmountService);
  const executionService = TestBed.inject(TransferExecutionService);
  const validationService = TestBed.inject(TransferValidationService);

  return {
    httpMock,
    transferStore,
    ngrxStore,
    alertService,
    recipientService,
    accountSelectionService,
    amountService,
    executionService,
    validationService,
  };
}

export function cleanupTransferTest(httpMock: HttpTestingController): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
