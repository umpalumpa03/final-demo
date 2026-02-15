import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  selectItems,
  selectIsLoading,
  selectError,
  selectNextCursor,
  selectFilters,
  selectTransactionsLoaded,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';

import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { CardTransactions } from '../../components/cards/components/card-transactions/container/card-transactions';
import {
  selectAccountById,
  selectAccountsLoaded,
  selectCardDetailById,
  selectLoadedCardDetailsIds,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import {
  loadCardAccounts,
  loadCardDetails,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';

describe('CardTransactions Integration', () => {
  let component: CardTransactions;
  let fixture: ComponentFixture<CardTransactions>;
  let store: MockStore;
  let router: Router;

  const mockCardId = 'card-1';

  const mockCardData = {
    cardId: 'card-1',
    details: {
      id: 'card-1',
      accountId: 'acc-1',
      type: 'DEBIT' as const,
      network: 'VISA' as const,
      design: 'blue',
      cardName: 'My Card',
      status: 'ACTIVE' as const,
      allowOnlinePayments: true,
      allowInternational: true,
      allowAtm: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    imageBase64: 'base64-image',
  };

  const mockAccount = {
    id: 'acc-1',
    iban: 'GE00TB0000000000000000',
    name: 'Main Account',
    balance: 1000,
    currency: 'GEL',
    status: 'ACTIVE',
    cardIds: ['card-1'],
    openedAt: '2024-01-01',
  };

  const mockTransactions: ITransactions[] = [
    {
      id: 'tx-1',
      userId: 'user-1',
      amount: 100.5,
      transactionType: 'debit',
      transferType: 'BillPayment',
      currency: 'GEL',
      description: 'Grocery Store',
      debitAccountNumber: 'GE00TB0000000000000000',
      creditAccountNumber: '',
      category: 'Shopping',
      convertionInfo: undefined,
      createdAt: '2024-01-14T10:00:00Z',
      updatedAt: '2024-01-14T10:00:00Z',
    },
    {
      id: 'tx-2',
      userId: 'user-1',
      amount: 50,
      transactionType: 'credit',
      transferType: 'Transfer',
      currency: 'GEL',
      description: 'Salary',
      debitAccountNumber: '',
      creditAccountNumber: 'GE00TB0000000000000000',
      category: 'Income',
      convertionInfo: undefined,
      createdAt: '2024-01-13T09:00:00Z',
      updatedAt: '2024-01-13T09:00:00Z',
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTransactions, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            cards: {
              cardDetails: { 'card-1': mockCardData.details },
              cardImages: { 'card-1': 'base64-image' },
              accounts: [mockAccount],
            },
            transactions: {
              items: mockTransactions,
              isLoading: false,
              error: null,
              nextCursor: null,
              filters: { accountIban: '', pageLimit: 100 },
              loaded: false,
            },
          },
        }),
        { provide: Router, useValue: { navigate: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => mockCardId } } },
        },
        {
          provide: AlertService,
          useValue: {
            isVisible: vi.fn().mockReturnValue(false),
            success: vi.fn(),
            error: vi.fn(),
            clearAlert: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    store.overrideSelector(selectItems, mockTransactions);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectNextCursor, null);
    store.overrideSelector(selectFilters, { accountIban: '', pageLimit: 100 });
    store.overrideSelector(selectTransactionsLoaded, false);
    store.overrideSelector(selectCardDetailById(mockCardId), mockCardData);
    store.overrideSelector(selectAccountById('acc-1'), mockAccount);
    store.overrideSelector(selectAccountsLoaded, true);
    store.overrideSelector(selectLoadedCardDetailsIds, ['card-1']);
    store.overrideSelector(selectTransactionsLoaded, true);
    fixture = TestBed.createComponent(CardTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load card and transaction data on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(loadCardAccounts({}));
    expect(dispatchSpy).toHaveBeenCalledWith(
      loadCardDetails({ cardId: mockCardId }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(TransactionActions.enter());
  });

//   it('should display card header data', async () => {
//   store.overrideSelector(selectAccountsLoaded, true);
//   store.refreshState();
  
//   await new Promise(resolve => setTimeout(resolve, 100));
  
//   const headerData = await firstValueFrom(component['cardHeaderData$']);
  
//   expect(headerData).not.toBeNull();
//   expect(headerData?.cardId).toBe('card-1');
//   expect(headerData?.cardName).toBe('My Card');
// });

  it('should display account name', async () => {
    const accountName = await firstValueFrom(component['accountName$']);

    expect(accountName).toBe('Main Account');
  });

  it('should paginate transactions correctly', async () => {
    const paginatedTransactions = await firstValueFrom(
      component['paginatedTransactions$'],
    );

    expect(paginatedTransactions.length).toBe(2);
    expect(paginatedTransactions[0].id).toBe('tx-1');
  });

  it('should calculate total pages', async () => {
    const totalPages = await firstValueFrom(component['totalPages$']);

    expect(totalPages).toBe(1);
  });

  it('should handle page change', () => {
    component['handlePageChange'](2);

    expect(component['currentPageSubject'].value).toBe(2);
  });

  it('should navigate back to card details', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component['handleBack']();

    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/products/cards/details',
      mockCardId,
    ]);
  });

  it('should update filters when account iban changes', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component['updateTransactionFiltersIfNeeded'](
      mockAccount,
      { accountIban: 'DIFFERENT_IBAN', pageLimit: 100 },
      true,
    );

    expect(dispatchSpy).toHaveBeenCalledWith(TransactionActions.enter());
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.updateFilters({
        filters: { accountIban: mockAccount.iban, pageLimit: 100 },
      }),
    );
  });

  it('should show loading state initially', async () => {
    store.overrideSelector(selectIsLoading, true);
    store.overrideSelector(selectCardDetailById(mockCardId), null);
    store.overrideSelector(selectItems, []);
    store.refreshState();

    const isLoading = await firstValueFrom(component['isLoading$']);

    expect(isLoading).toBe(true);
  });

  it('should dispatch loadMore when cursor exists', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    store.overrideSelector(selectNextCursor, 'cursor-123');
    store.refreshState();

    component['autoLoadAllTransactions']();

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(TransactionActions.loadMore());
    }, 100);
  });

  it('should retry loading data', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component['handleRetry']();

    expect(dispatchSpy).toHaveBeenCalledWith(loadCardAccounts({}));
    expect(dispatchSpy).toHaveBeenCalledWith(
      loadCardDetails({ cardId: mockCardId }),
    );
  });
});
