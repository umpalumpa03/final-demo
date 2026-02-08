

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CardTransactions } from './card-transactions';
import {
  loadCardDetails,
  loadCardAccounts,
} from '../../../../../../../../store/products/cards/cards.actions';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';

interface MockStore {
  select: Mock;
  dispatch: Mock;
}

interface MockRouter {
  navigate: Mock;
}

describe('CardTransactions', () => {
  let component: CardTransactions;
  let fixture: ComponentFixture<CardTransactions>;
  let store: MockStore;
  let router: MockRouter;

  const mockCardId = 'card-123';
  const mockCardData = {
    cardId: mockCardId,
    details: {
      accountId: 'acc-1',
      cardName: 'Test Card',
    },
    imageBase64: 'base64image'
  };
  const mockAccount = {
    id: 'acc-1',
    iban: 'GE123456789',
    name: 'Main Account',
  };
  const mockTransactions = [
    { id: 'tx-1', amount: 100, currency: 'GEL', transactionType: 'debit' },
    { id: 'tx-2', amount: 200, currency: 'GEL', transactionType: 'credit' },
  ];

  beforeEach(async () => {
    const storeMock: MockStore = {
      select: vi.fn((selector) => {
        const selectorStr = selector.toString();
        if (selectorStr.includes('selectCardDetailById')) return of(mockCardData);
        if (selectorStr.includes('selectAccountById')) return of(mockAccount);
        if (selectorStr.includes('selectItems')) return of(mockTransactions);
        if (selectorStr.includes('selectIsLoading')) return of(false);
        if (selectorStr.includes('selectError')) return of(null);
        if (selectorStr.includes('selectNextCursor')) return of(null);
        return of(null);
      }),
      dispatch: vi.fn(),
    };

    const routerMock: MockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(mockCardId),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [CardTransactions],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as unknown as MockStore;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture = TestBed.createComponent(CardTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch actions on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(TransactionActions.enter());
    expect(store.dispatch).toHaveBeenCalledWith(loadCardAccounts());
    expect(store.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: mockCardId }));
  });

  it('should navigate back to card details', () => {
    component['handleBack']();
    expect(router.navigate).toHaveBeenCalledWith(['/bank/products/cards/details', mockCardId]);
  });

  it('should reload data on retry', () => {
    store.dispatch = vi.fn();
    component['handleRetry']();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should update page number', () => {
    component['handlePageChange'](2);
    expect(component['currentPageSubject'].value).toBe(2);
  });

  it('should handle null transactions in pagination', async () => {
    store.select = vi.fn(() => of(null));
    const paginated = await firstValueFrom(component['paginatedTransactions$']);
    expect(paginated).toEqual([]);
  });

  it('should handle null in total pages', async () => {
    store.select = vi.fn(() => of(null));
    const totalPages = await firstValueFrom(component['totalPages$']);
    expect(totalPages).toBe(1);
  });

  it('should handle null transactions in totalCount', async () => {
    store.select = vi.fn(() => of(null));
    const totalCount = await firstValueFrom(component['totalCount$']);
    expect(totalCount).toBe(0);
  });

  it('should return null when card has no account', async () => {
    store.select = vi.fn((selector) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectCardDetailById')) return of({ details: {} });
      return of(null);
    });
    
    const headerData = await firstValueFrom(component['cardHeaderData$']);
    expect(headerData).toBeNull();
  });

  it('should return null when account is not found', async () => {
    store.select = vi.fn((selector) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectCardDetailById')) return of(mockCardData);
      if (selectorStr.includes('selectAccountById')) return of(null);
      return of(null);
    });
    
    const headerData = await firstValueFrom(component['cardHeaderData$']);
    expect(headerData).toBeNull();
  });

  it('should return N/A when no account found', async () => {
    store.select = vi.fn((selector) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectCardDetailById')) return of({ details: {} });
      return of(null);
    });
    
    const accountName = await firstValueFrom(component['accountName$']);
    expect(accountName).toBe('N/A');
  });

  it('should cleanup on destroy', () => {
    const nextSpy = vi.spyOn(component['destroy$'], 'next');
    const completeSpy = vi.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should auto-dispatch loadMore when cursor exists', () => {
    store.select = vi.fn((selector) => {
      const selectorStr = selector.toString();
      if (selectorStr.includes('selectNextCursor')) return of('cursor-123');
      if (selectorStr.includes('selectCardDetailById')) return of(mockCardData);
      if (selectorStr.includes('selectAccountById')) return of(mockAccount);
      return of([]);
    });
    
    const newFixture = TestBed.createComponent(CardTransactions);
    newFixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(TransactionActions.loadMore());
  });
  it('should have itemsPerPage set to 20', () => {
  expect(component['itemsPerPage']).toBe(20);
});

it('should initialize currentPageSubject with value 1', () => {
  expect(component['currentPageSubject'].value).toBe(1);
});


it('should return 1 when transactions is null in totalPages$', async () => {
  store.select = vi.fn((selector) => {
    const selectorStr = selector.toString();
    if (selectorStr.includes('selectItems')) return of(null);
    return of(null);
  });
  
  const newFixture = TestBed.createComponent(CardTransactions);
  const newComponent = newFixture.componentInstance;
  
  const totalPages = await firstValueFrom(newComponent['totalPages$']);
  expect(totalPages).toBe(1);
});

it('should return null when cardData has no accountId in cardHeaderData$', async () => {
  store.select = vi.fn((selector) => {
    const selectorStr = selector.toString();
    if (selectorStr.includes('selectCardDetailById')) return of({ details: { accountId: null } });
    return of(null);
  });
  
  const newFixture = TestBed.createComponent(CardTransactions);
  const newComponent = newFixture.componentInstance;
  
  const headerData = await firstValueFrom(newComponent['cardHeaderData$']);
  expect(headerData).toBeNull();
});

it('should return N/A when cardData has no accountId in accountName$', async () => {
  store.select = vi.fn((selector) => {
    const selectorStr = selector.toString();
    if (selectorStr.includes('selectCardDetailById')) return of({ details: { accountId: null } });
    return of(null);
  });
  
  const newFixture = TestBed.createComponent(CardTransactions);
  const newComponent = newFixture.componentInstance;
  
  const accountName = await firstValueFrom(newComponent['accountName$']);
  expect(accountName).toBe('N/A');
});
});



