import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { AccountCards } from './account-cards';
import { loadAccountCardsPage } from '../../../../../../../../store/products/cards/cards.actions';
import { AccountData, ViewState } from '@tia/shared/models/cards/account-cards.model';
import * as CardsSelectors from '../../../../../../../../store/products/cards/cards.selectors';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardWithDetails } from '@tia/shared/models/cards/card-image.model';

interface MockStore {
  select: Mock;
  dispatch: Mock;
}

interface MockRouter {
  navigate: Mock;
}

interface MockActivatedRoute {
  snapshot: {
    paramMap: {
      get: Mock;
    };
  };
}

describe('AccountCards', () => {
  let component: AccountCards;
  let fixture: ComponentFixture<AccountCards>;
  let store: MockStore;
  let router: MockRouter;

  const mockAccountId = 'acc-123';
  const mockAccounts: CardAccount[] = [
    {
      id: 'acc-123',
      iban: 'GE00TB0000000000000000',
      name: 'My Account',
      balance: 1000,
      currency: 'GEL',
      status: 'ACTIVE',
      cardIds: ['card-123', 'card-456'],
      openedAt: '2024-01-01',
    },
  ];

  const mockCards: CardWithDetails[] = [
    {
      cardId: 'card-123',
      details: {
        id: 'card-123',
        accountId: 'acc-123',
        type: 'DEBIT' as const,
        network: 'VISA' as const,
        design: 'design-1',
        cardName: 'My Debit Card',
        status: 'ACTIVE' as const,
        allowOnlinePayments: true,
        allowInternational: true,
        allowAtm: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      imageBase64: 'data:image/png;base64,abc123',
    },
    {
      cardId: 'card-456',
      details: {
        id: 'card-456',
        accountId: 'acc-123',
        type: 'CREDIT' as const,
        network: 'MASTERCARD' as const,
        design: 'design-2',
        cardName: 'My Credit Card',
        status: 'ACTIVE' as const,
        allowOnlinePayments: true,
        allowInternational: true,
        creditLimit: 5000,
        allowAtm: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      imageBase64: 'data:image/png;base64,def456',
    },
  ];

  beforeEach(async () => {
    const storeMock: MockStore = {
      select: vi.fn((selector) => {
        if (selector === CardsSelectors.selectAllAccounts) {
          return of(mockAccounts);
        }
        if (selector === CardsSelectors.selectCardDetailsLoading) {
          return of(false);
        }
        if (selector === CardsSelectors.selectCardDetailsError) {
          return of(null);
        }
        if (typeof selector === 'function' || selector.projector) {
          return of(mockCards);
        }
        return of(null);
      }),
      dispatch: vi.fn(),
    };

    const routerMock: MockRouter = {
      navigate: vi.fn(),
    };

    const activatedRouteMock: MockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(mockAccountId),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [AccountCards],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as unknown as MockStore;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture = TestBed.createComponent(AccountCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadAccountCardsPage on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadAccountCardsPage({ accountId: mockAccountId }));
  });

  it('should navigate to card details', () => {
    component['handleCardClick']('card-123');
    expect(router.navigate).toHaveBeenCalledWith(['/bank/products/cards/details', 'card-123']);
  });

  it('should emit loading false', () => {
    let result: boolean | undefined;
    component['cardDetailsLoading$'].subscribe((val: boolean) => {
      result = val;
    });
    expect(result).toBe(false);
  });

  it('should emit null error', () => {
    let result: string | null | undefined;
    component['cardDetailsError$'].subscribe((val: string | null) => {
      result = val;
    });
    expect(result).toBeNull();
  });

  it('should emit accountData', () => {
    let result: AccountData | null | undefined;
    component['accountData$'].subscribe((val: AccountData | null) => {
      result = val;
    });
    expect(result).toEqual({
      account: mockAccounts[0],
      cards: mockCards,
    });
  });

  it('should emit success viewState', () => {
    let result: ViewState | undefined;
    component['viewState$'].subscribe((val: ViewState) => {
      result = val;
    });
    expect(result).toBe('success');
  });

  it('should emit cardsLabel', () => {
    let result: string | undefined;
    component['cardsLabel$'].subscribe((val: string) => {
      result = val;
    });
    expect(result).toBe('2 Cards');
  });
});