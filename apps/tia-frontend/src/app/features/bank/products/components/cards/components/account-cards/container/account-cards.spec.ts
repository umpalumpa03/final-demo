import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AccountCards } from './account-cards';
import { loadCardAccounts, loadCardDetails } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectAllAccounts,
  selectCardDetailsByAccountId,
  selectCardDetailsError,
  selectCardDetailsLoading,
} from '../../../../../../../../store/products/cards/cards.selectors';

import { By } from '@angular/platform-browser';
import { CardWithDetails } from '@tia/shared/models/cards/card-image.model';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';

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

  const setupTestBed = async (
    accounts: CardAccount[] = mockAccounts, 
    cards: CardWithDetails[] = mockCardsWithDetails,
    loading: boolean = false,
    error: string | null = null
  ) => {
    mockStore.select.mockImplementation((selector: unknown) => {
      if (selector === selectAllAccounts) {
        return of(accounts);
      }
      if (selector === selectCardDetailsLoading) {
        return of(loading);
      }
      if (selector === selectCardDetailsError) {
        return of(error);
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

  it('should select accounts on initialization', () => {
    fixture.detectChanges();
    expect(mockStore.select).toHaveBeenCalledWith(selectAllAccounts);
  });

  it('should dispatch loadCardAccounts when accounts are empty', async () => {
    await setupTestBed([], []);
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardAccounts());
  });

  it('should dispatch loadCardDetails for each cardId when accounts loaded', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: 'card1' }));
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: 'card2' }));
  });

  it('should compute accountData correctly with account and cards', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    
    const accountData = component['accountData']();
    
    expect(accountData).toBeDefined();
    expect(accountData?.account.id).toBe(mockAccountId);
    expect(accountData?.cards).toHaveLength(2);
  });

  it('should return null accountData when account not found', async () => {
    await setupTestBed([], []);
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component['accountData']()).toBeNull();
  });

  it('should compute viewState as no-account when account not found', async () => {
    await setupTestBed([], []);
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component['viewState']()).toBe('no-account');
  });

  it('should compute viewState as loading when cardDetailsLoading is true', async () => {
    await setupTestBed(mockAccounts, mockCardsWithDetails, true, null);
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component['viewState']()).toBe('loading');
  });

  it('should compute viewState as error when cardDetailsError is set', async () => {
    await setupTestBed(mockAccounts, mockCardsWithDetails, false, 'Error message');
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component['viewState']()).toBe('error');
  });

  it('should compute viewState as success when data is loaded', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component['viewState']()).toBe('success');
  });

  it('should compute cardsLabel correctly', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component['cardsLabel']()).toBe('2 Cards');
  });

  it('should compute cardsLabel with singular Card', async () => {
    const singleCardAccount = [{ ...mockAccounts[0], cardIds: ['card1'] }];
    await setupTestBed(singleCardAccount, [mockCardsWithDetails[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(component['cardsLabel']()).toBe('1 Card');
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

  describe('getCardBadgeVariant', () => {
    it('should return success for DEBIT', () => {
      expect(component['getCardBadgeVariant']('DEBIT')).toBe('success');
    });

    it('should return warning for CREDIT', () => {
      expect(component['getCardBadgeVariant']('CREDIT')).toBe('warning');
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

    it('should show loading state', async () => {
      await setupTestBed(mockAccounts, [], true, null);  
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

    it('should display error message', async () => {
      const errorMsg = 'Failed to load card details';
      await setupTestBed(mockAccounts, mockCardsWithDetails, false, errorMsg);
      await fixture.whenStable();
      fixture.detectChanges();
      
      const error = fixture.nativeElement.querySelector('.account-cards__error');
      expect(error?.textContent).toContain(errorMsg);
    });
  });
});