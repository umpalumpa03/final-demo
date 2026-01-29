import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AccountCards } from './account-cards';
import { loadCardDetails } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectAllAccounts,
  selectCardDetailsByAccountId,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { CardAccount } from '../../../models/card-account.model';
import { CardWithDetails } from '../../../models/card-image.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AccountCards', () => {
  let component: AccountCards;
  let fixture: ComponentFixture<AccountCards>;
  let mockStore: {
    select: ReturnType<typeof vi.fn>;
    dispatch: ReturnType<typeof vi.fn>;
  };
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const mockAccountId = 'acc1';
  
  const mockAccounts: CardAccount[] = [
    {
      id: 'acc1',
      iban: 'GE29TIA7890123456789012',
      name: 'Main GEL Account',
      balance: 4500000,
      currency: 'GEL',
      status: 'active',
      cardIds: ['card1', 'card2'],
      openedAt: '2026-01-18T01:10:50.948Z',
    },
  ];

  const mockCardsWithDetails: CardWithDetails[] = [
    {
      cardId: 'card1',
      details: {
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
      },
      imageBase64: 'data:image/svg+xml;base64,test1',
    },
    {
      cardId: 'card2',
      details: {
        id: 'card2',
        accountId: 'acc1',
        type: 'CREDIT',
        network: 'MASTERCARD',
        design: 'OCEAN_BLUE',
        cardName: 'Premium Credit',
        status: 'ACTIVE',
        creditLimit: 5000,
        allowOnlinePayments: true,
        allowInternational: true,
        allowAtm: true,
        createdAt: '2026-01-18T01:10:50.948Z',
        updatedAt: '2026-01-18T01:10:50.948Z',
      },
      imageBase64: 'data:image/svg+xml;base64,test2',
    },
  ];

  const setupTestBed = async (accounts: CardAccount[] = mockAccounts, cards: CardWithDetails[] = mockCardsWithDetails) => {
    mockStore.select.mockImplementation((selector: unknown) => {
      if (selector === selectAllAccounts) {
        return of(accounts);
      }
      return of(cards);
    });

    fixture = TestBed.createComponent(AccountCards);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    mockStore = {
      select: vi.fn(),
      dispatch: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    const activatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(mockAccountId),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [AccountCards],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    await setupTestBed();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load accounts on init', () => {
    fixture.detectChanges();
    expect(mockStore.select).toHaveBeenCalledWith(selectAllAccounts);
  });

  it('should load card details for account', () => {
    fixture.detectChanges();
    expect(mockStore.select).toHaveBeenCalled();
  });

  it('should dispatch loadCardDetails for each cardId', async () => {
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: 'card1' }));
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: 'card2' }));
  });

  it('should compute vm correctly with account and cards', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    
    const vmValue = component['vm']();
    
    expect(vmValue).toBeDefined();
    expect(vmValue?.account.id).toBe(mockAccountId);
    expect(vmValue?.cards).toHaveLength(2);
  });

  it('should return null vm when account not found', async () => {
    await setupTestBed([], []);
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component['vm']()).toBeNull();
  });

  describe('handleCardClick', () => {
    it('should navigate to card details', () => {
      component['handleCardClick']('card1');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/products/cards/details', 'card1']);
    });
  });

  describe('shouldShowCreditLimit', () => {
    it('should return true for credit card with credit limit', () => {
      expect(component['shouldShowCreditLimit'](mockCardsWithDetails[1])).toBe(true);
    });

    it('should return false for debit card', () => {
      expect(component['shouldShowCreditLimit'](mockCardsWithDetails[0])).toBe(false);
    });

    it('should return false for credit card without credit limit', () => {
      const creditCardNoLimit: CardWithDetails = {
        ...mockCardsWithDetails[1],
        details: { ...mockCardsWithDetails[1].details, creditLimit: undefined },
      };
      
      expect(component['shouldShowCreditLimit'](creditCardNoLimit)).toBe(false);
    });
  });

  describe('template rendering', () => {
    const detectChangesAndWait = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };

    it('should display account information', async () => {
      await detectChangesAndWait();
      
      const accountName = fixture.nativeElement.querySelector('.account-cards__account-name');
      const accountNumber = fixture.nativeElement.querySelector('.account-cards__account-number');
      
      expect(accountName?.textContent).toContain('Main GEL Account');
      expect(accountNumber?.textContent).toContain('GE29TIA7890123456789012');
    });

    it('should display cards count badge', async () => {
      await detectChangesAndWait();
      expect(fixture.nativeElement.querySelector('app-badges')).toBeTruthy();
    });

    it('should render card grid when cards are loaded', async () => {
      await detectChangesAndWait();
      
      const cardElements = fixture.debugElement.queryAll(By.css('.account-cards__card'));
      expect(cardElements.length).toBeGreaterThan(0);
    });

    it('should show loading state when cards array is empty', async () => {
      await setupTestBed(mockAccounts, []);
      await detectChangesAndWait();
      
      const loading = fixture.nativeElement.querySelector('.account-cards__loading');
      expect(loading?.textContent).toContain('Loading cards...');
    });

    it('should show error when account not found', async () => {
      await setupTestBed([], []);
      await detectChangesAndWait();
      
      const error = fixture.nativeElement.querySelector('.account-cards__error');
      expect(error?.textContent).toContain('Account not found');
    });
  });
});