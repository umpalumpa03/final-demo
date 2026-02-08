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
    expect(store.dispatch).toHaveBeenCalledWith(loadCardAccounts());
    expect(store.dispatch).toHaveBeenCalledWith(
      loadCardDetails({ cardId: mockCardId }),
    );
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

  it('should cleanup on destroy', () => {
    const destroySpy = vi.spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should calculate total pages correctly', () => {
    let pages = 0;
    component['totalPages$'].subscribe((p) => {
      pages = p;
    });
    expect(pages).toBe(0);
  });

  it('should calculate paginated transactions correctly', () => {
    let transactions: any[] = [];
    component['paginatedTransactions$'].subscribe((t) => {
      transactions = t;
    });
    expect(transactions).toEqual([]);
  });

  it('should calculate total count correctly', () => {
    let count = 0;
    component['totalCount$'].subscribe((c) => {
      count = c;
    });
    expect(count).toBe(0);
  });

  it('should have correct items per page', () => {
    expect(component['itemsPerPage']).toBe(20);
  });

  it('should get card header data from store', () => {
    let data: any = undefined;
    component['cardHeaderData$'].subscribe((d) => {
      data = d;
    });
    expect(data).toBeNull();
  });

  it('should get account name from store', () => {
    let name = '';
    component['accountName$'].subscribe((n) => {
      name = n;
    });
    expect(name).toBe('N/A');
  });

  it('should have loading state', () => {
    let loading = false;
    component['isLoading$'].subscribe((l) => {
      loading = l;
    });
    expect(typeof loading).toBe('boolean');
  });
  it('should return null when cardData has no accountId in cardHeaderData$', () => {
    store.select = vi.fn((selector) => {
      if (selector.name?.includes('selectCardDetailById')) {
        return of({
          cardId: 'card-1',
          details: { accountId: null },
          imageBase64: 'img',
        });
      }
      return of(null);
    });

    let result: any;
    component['cardHeaderData$'].subscribe((r) => (result = r));
    expect(result).toBeNull();
  });

  it('should return N/A when cardData has no accountId in accountName$', () => {
    store.select = vi.fn((selector) => {
      if (selector.name?.includes('selectCardDetailById')) {
        return of({
          cardId: 'card-1',
          details: { accountId: null },
          imageBase64: 'img',
        });
      }
      return of(null);
    });

    let result = '';
    component['accountName$'].subscribe((r) => (result = r));
    expect(result).toBe('N/A');
  });

  it('should return empty array when transactions is null in paginatedTransactions$', () => {
    store.select = vi.fn((selector) => {
      if (selector === selectItems) return of(null);
      return of(1);
    });

    let result: any[] = [];
    component['paginatedTransactions$'].subscribe((r) => (result = r));
    expect(result).toEqual([]);
  });

  it('should return 0 when transactions is null in totalPages$', () => {
    store.select = vi.fn((selector) => {
      if (selector === selectItems) return of(null);
      return of(null);
    });

    let result = -1;
    component['totalPages$'].subscribe((r) => (result = r));
    expect(result).toBe(0);
  });
  it('should handle ngOnDestroy cleanup', () => {
  const nextSpy = vi.spyOn(component['destroy$'], 'next');
  const completeSpy = vi.spyOn(component['destroy$'], 'complete');
  
  component.ngOnDestroy();
  
  expect(nextSpy).toHaveBeenCalled();
  expect(completeSpy).toHaveBeenCalled();
});


it('should dispatch loadMore when cursor is not null', async () => {
  store.select = vi.fn((selector) => {
    if (selector === selectNextCursor) {
      return of('cursor-123');
    }
    return of(null);
  });
  
  component['autoLoadAllTransactions']();
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  expect(store.dispatch).toHaveBeenCalledWith(TransactionActions.loadMore());
});
});





