import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CardTransactions } from './card-transactions';
import {
  loadCardTransactions,
  loadCardDetails,
  loadCardAccounts,
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
    expect(store.dispatch).toHaveBeenCalledWith(loadCardAccounts());
    expect(store.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: mockCardId }));
    expect(store.dispatch).toHaveBeenCalledWith(loadCardTransactions({ cardId: mockCardId }));
  });

  it('should navigate back to card details', () => {
    component['handleBack']();
    expect(router.navigate).toHaveBeenCalledWith(['/bank/products/cards', mockCardId]);
  });

  it('should retry loading data', () => {
    store.dispatch = vi.fn();
    component['handleRetry']();
    expect(store.dispatch).toHaveBeenCalledTimes(3);
  });
});