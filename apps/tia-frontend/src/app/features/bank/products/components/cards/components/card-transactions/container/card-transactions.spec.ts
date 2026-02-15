import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CardTransactions } from './card-transactions';
import {
  loadCardDetails,
  loadCardAccounts,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectItems,
  selectIsLoading,
  selectError,
  selectNextCursor,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { AlertService } from '@tia/core/services/alert/alert.service';

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

  beforeEach(async () => {
    const storeMock: MockStore = {
      select: vi.fn((selector) => {
        if (selector === selectItems) {
          return of([]);
        }
        if (selector === selectIsLoading) {
          return of(false);
        }
        if (selector === selectError) {
          return of(null);
        }
        if (selector === selectNextCursor) {
          return of(null);
        }
        return of(null);
      }),
      dispatch: vi.fn(),
    };

    const routerMock: MockRouter = {
      navigate: vi.fn(),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(mockCardId),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [CardTransactions, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
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

    store = TestBed.inject(Store) as unknown as MockStore;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture = TestBed.createComponent(CardTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadCardAccounts on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadCardAccounts({}));
  });

  it('should navigate back to card details', () => {
    component['handleBack']();
    expect(router.navigate).toHaveBeenCalledWith([
      '/bank/products/cards/details',
      mockCardId,
    ]);
  });

  it('should retry loading data', () => {
    store.dispatch = vi.fn();
    component['handleRetry']();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should handle page change', () => {
    component['handlePageChange'](2);
    expect(component['currentPageSubject'].value).toBe(2);
  });

  it('should dispatch loadMore when cursor is not null', async () => {
    store.select = vi.fn((selector) => {
      if (selector === selectNextCursor) {
        return of('cursor-123');
      }
      return of(null);
    });

    component['autoLoadAllTransactions']();

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(store.dispatch).toHaveBeenCalledWith(TransactionActions.loadMore());
  });

  it('should return true in isLoading$ when cardData is null', () => {
    store.select = vi.fn((selector) => {
      if (selector.name?.includes('selectAccountsLoaded')) return of(true);
      if (selector === selectIsLoading) return of(false);
      if (selector.name?.includes('selectCardDetailById')) return of(null);
      if (selector === selectItems) return of([]);
      if (selector.name?.includes('selectTransactionsLoaded')) return of(true);
      return of(null);
    });

    fixture = TestBed.createComponent(CardTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let result = false;
    component['isLoading$'].subscribe((r) => (result = r));
    expect(result).toBe(true);
  });

  it('should return true in isLoading$ when transactionsLoaded is false and no transactions', () => {
    store.select = vi.fn((selector) => {
      if (selector.name?.includes('selectAccountsLoaded')) return of(true);
      if (selector === selectIsLoading) return of(false);
      if (selector.name?.includes('selectCardDetailById')) return of({ details: { accountId: 'acc-1' } });
      if (selector === selectItems) return of([]);
      if (selector.name?.includes('selectTransactionsLoaded')) return of(false);
      return of(null);
    });

    fixture = TestBed.createComponent(CardTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let result = false;
    component['isLoading$'].subscribe((r) => (result = r));
    expect(result).toBe(true);
  });

  it('should return loading true when accountsLoaded is false', () => {
    store.select = vi.fn((selector) => {
      if (selector.name?.includes('selectAccountsLoaded')) return of(false);
      if (selector === selectIsLoading) return of(false);
      if (selector.name?.includes('selectCardDetailById')) return of({ details: {} });
      if (selector === selectItems) return of([]);
      if (selector.name?.includes('selectTransactionsLoaded')) return of(true);
      return of(null);
    });

    fixture = TestBed.createComponent(CardTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let result = false;
    component['isLoading$'].subscribe(r => result = r);
    expect(result).toBe(true);
  });

  it('should compute pagination config', () => {
    const config = component['paginationConfig']();
    expect(config.maxVisiblePages).toBe(2);
    expect(config.showEllipsis).toBe(true);
  });

  it('should get total count from transactions', () => {
    const mockTransactions = [{}, {}, {}];
    const count = component['getTotalCount'](mockTransactions);
    expect(count).toBe(3);
  });

  it('should return 0 for empty transactions in getTotalCount', () => {
    const count = component['getTotalCount']([]);
    expect(count).toBe(0);
  });

  it('should paginate transactions correctly', () => {
    const mockTransactions = new Array(25).fill({});
    const paginated = component['getPaginatedTransactions'](mockTransactions, 2);
    expect(paginated.length).toBe(5);
  });

  it('should return empty array for null transactions in getPaginatedTransactions', () => {
    const paginated = component['getPaginatedTransactions'](null as any, 1);
    expect(paginated).toEqual([]);
  });

  it('should calculate total pages correctly', () => {
    const mockTransactions = new Array(25).fill({});
    const pages = component['getTotalPages'](mockTransactions);
    expect(pages).toBe(2);
  });

  it('should return 0 pages for null transactions', () => {
    const pages = component['getTotalPages'](null as any);
    expect(pages).toBe(0);
  });
 
  
});
