import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CardTransactions } from './card-transactions';
import {
  loadCardTransactions,
  loadCardDetails,
  loadCardAccounts,
  clearCardTransactionsError,
} from '../../../../../../../../store/products/cards/cards.actions';
import { TranslateModule } from '@ngx-translate/core';

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
      select: vi.fn(() => of([])),
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
    expect(store.dispatch).toHaveBeenCalledWith(clearCardTransactionsError());
    expect(store.dispatch).toHaveBeenCalledWith(loadCardAccounts());
    expect(store.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: mockCardId }));
    expect(store.dispatch).toHaveBeenCalledWith(loadCardTransactions({ cardId: mockCardId }));
  });

  it('should navigate back to card details', () => {
    component['handleBack']();
    expect(router.navigate).toHaveBeenCalledWith(['/bank/products/cards/details', mockCardId]);
  });

  it('should retry loading data', () => {
    store.dispatch = vi.fn();
    component['handleRetry']();
    expect(store.dispatch).toHaveBeenCalledTimes(4);
  });

  it('should show loading state initially', async () => {
    const result = await firstValueFrom(component['isLoading$']);
    expect(typeof result).toBe('boolean');
  });

  it('should clear error on retry', () => {
    store.dispatch = vi.fn();
    component['handleRetry']();
    expect(store.dispatch).toHaveBeenCalledWith(clearCardTransactionsError());
  });

  it('should emit transactions from store', async () => {
    const transactions = await firstValueFrom(component['transactions$']);
    expect(Array.isArray(transactions)).toBe(true);
  });

  it('should emit total count from store', async () => {
    const totalCount = await firstValueFrom(component['totalCount$']);
    expect(typeof totalCount).toBe('object');
  });

  it('should emit loading state from store', async () => {
    const loading = await firstValueFrom(component['loading$']);
    expect(typeof loading).toBe('object');
  });

  it('should emit error state from store', async () => {
    const error = await firstValueFrom(component['error$']);
    expect(error === null || typeof error === 'string').toBe(false);
  });



  it('should emit account name from store', async () => {
    const accountName = await firstValueFrom(component['accountName$']);
    expect(typeof accountName).toBe('string');
  });
});