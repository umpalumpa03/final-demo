import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AccountCards } from './account-cards';
import { loadCardDetails } from '../../../../../../../../store/products/cards/cards.actions';
import { CardAccount } from '../../../models/card-account.model';
import { CardDetail } from '../../../models/card-detail.model';

describe('AccountCards', () => {
  let component: AccountCards;
  let fixture: ComponentFixture<AccountCards>;
  let mockStore: { select: ReturnType<typeof vi.fn>; dispatch: ReturnType<typeof vi.fn> };
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: { snapshot: { paramMap: { get: ReturnType<typeof vi.fn> } } };

  const mockAccount: CardAccount = {
    id: 'acc1',
    iban: 'GE29TIA7890123456789012',
    name: 'Main GEL Account',
    balance: 4500000,
    currency: 'GEL',
    status: 'active',
    cardIds: ['card1', 'card2'],
    openedAt: '2026-01-18T01:10:50.948Z',
  };

  const mockCardDetail1: CardDetail = {
    id: 'card1',
    accountId: 'acc1',
    type: 'DEBIT',
    network: 'VISA',
    design: 'MIDNIGHT_GRADIENT',
    cardName: 'Main Visa',
    status: 'ACTIVE',
    allowOnlinePayments: true,
    allowInternational: true,
    allowAtm: true,
    createdAt: '2026-01-18T01:10:50.948Z',
    updatedAt: '2026-01-18T01:10:50.948Z',
  };

  const mockCardDetail2: CardDetail = {
    id: 'card2',
    accountId: 'acc1',
    type: 'CREDIT',
    network: 'MASTERCARD',
    design: 'OCEAN_BLUE',
    cardName: 'Secondary Card',
    status: 'ACTIVE',
    allowOnlinePayments: true,
    allowInternational: false,
    allowAtm: true,
    creditLimit: 5000,
    createdAt: '2026-01-18T01:10:50.948Z',
    updatedAt: '2026-01-18T01:10:50.948Z',
  };

  const mockCards = [
    {
      cardId: 'card1',
      details: mockCardDetail1,
      imageBase64: 'data:image/svg+xml;base64,test1',
    },
    {
      cardId: 'card2',
      details: mockCardDetail2,
      imageBase64: 'data:image/svg+xml;base64,test2',
    },
  ];

  beforeEach(async () => {
    mockStore = {
      select: vi.fn((selector) => {
        const selectorString = selector.toString();
        if (selectorString.includes('selectAllAccounts')) {
          return of([mockAccount]);
        }
        if (selectorString.includes('selectCardDetailsByAccountId')) {
          return of(mockCards);
        }
        return of(null);
      }),
      dispatch: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn(() => 'acc1'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [AccountCards],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCards);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get accountId from route on init', () => {
      fixture.detectChanges();
      expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('accountId');
    });

    it('should dispatch loadCardDetails for each card', () => {
      fixture.detectChanges();
      expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: 'card1' }));
      expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: 'card2' }));
      expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
    });

    it('should not dispatch actions if accountId is not found', () => {
      mockActivatedRoute.snapshot.paramMap.get = vi.fn(() => null);
      fixture.detectChanges();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch actions if account has no cards', () => {
      mockStore.select = vi.fn((selector) => {
        const selectorString = selector.toString();
        if (selectorString.includes('selectAllAccounts')) {
          return of([{ ...mockAccount, cardIds: [] }]);
        }
        return of([]);
      });
      
      fixture.detectChanges();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to card details when card is clicked', () => {
      fixture.detectChanges();
      component['handleCardClick']('card1');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/products/cards/details', 'card1']);
    });
  });

  describe('Data Display', () => {
    it('should display account information', () => {
      fixture.detectChanges();
      const account = component['account']();
      expect(account).toEqual(mockAccount);
    });

    it('should display card details', () => {
      fixture.detectChanges();
      const cards = component['cards']();
      expect(cards).toHaveLength(2);
      expect(cards[0].cardId).toBe('card1');
      expect(cards[1].cardId).toBe('card2');
    });

    it('should return empty array when account not found', () => {
      mockStore.select = vi.fn((selector) => {
        const selectorString = selector.toString();
        if (selectorString.includes('selectAllAccounts')) {
          return of([]);
        }
        return of([]);
      });

      fixture.detectChanges();
      const account = component['account']();
      expect(account).toBeUndefined();
    });

    it('should handle account with credit card showing limit', () => {
      fixture.detectChanges();
      const cards = component['cards']();
      const creditCard = cards.find(c => c.details.type === 'CREDIT');
      expect(creditCard?.details.creditLimit).toBe(5000);
    });

    it('should handle account with debit card without limit', () => {
      fixture.detectChanges();
      const cards = component['cards']();
      const debitCard = cards.find(c => c.details.type === 'DEBIT');
      expect(debitCard?.details.creditLimit).toBeUndefined();
    });
  });
});