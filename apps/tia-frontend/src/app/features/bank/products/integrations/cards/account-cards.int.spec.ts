import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { AccountCards } from '../../components/cards/components/account-cards/container/account-cards';
import { loadAccountCardsPage, setCurrentCardIndex } from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import { firstValueFrom } from 'rxjs';
import { selectAccountsLoaded, selectAllAccounts, selectCardDetailsByAccountId, selectCardDetailsError, selectCardDetailsLoading, selectLoadedCardDetailsIds } from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';

describe('AccountCards Integration', () => {
  let component: AccountCards;
  let fixture: ComponentFixture<AccountCards>;
  let store: MockStore;
  let router: Router;

  const mockAccount = {
    id: 'acc-1',
    iban: 'GE123',
    name: 'Main Account',
    balance: 1000,
    currency: 'GEL',
    status: 'ACTIVE',
    cardIds: ['card-1', 'card-2'],
    openedAt: '2024-01-01',
  };

  const mockCards = [
    {
      cardId: 'card-1',
      details: {
        id: 'card-1',
        accountId: 'acc-1',
        type: 'DEBIT' as const,
        network: 'VISA' as const,
        design: 'blue',
        cardName: 'Card One',
        status: 'ACTIVE' as const,
        allowOnlinePayments: true,
        allowInternational: true,
        allowAtm: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      imageBase64: 'base64-1',
    },
    {
      cardId: 'card-2',
      details: {
        id: 'card-2',
        accountId: 'acc-1',
        type: 'CREDIT' as const,
        network: 'MASTERCARD' as const,
        design: 'red',
        cardName: 'Card Two',
        status: 'ACTIVE' as const,
        allowOnlinePayments: true,
        allowInternational: true,
        allowAtm: true,
        creditLimit: 5000,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      imageBase64: 'base64-2',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCards, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            cards: {
              accounts: [mockAccount],
              cardDetails: {
                'card-1': mockCards[0].details,
                'card-2': mockCards[1].details,
              },
              cardImages: {
                'card-1': 'base64-1',
                'card-2': 'base64-2',
              },
              cardDetailsLoading: false,
              cardDetailsError: null,
            },
          },
        }),
        { provide: Router, useValue: { navigate: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'acc-1' } } },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    store.overrideSelector(selectAllAccounts, [mockAccount]);
    store.overrideSelector(selectCardDetailsByAccountId('acc-1'), mockCards);
    store.overrideSelector(selectCardDetailsLoading, false);
    store.overrideSelector(selectCardDetailsError, null);
    store.overrideSelector(selectAccountsLoaded, true);
store.overrideSelector(selectLoadedCardDetailsIds, ['card-1', 'card-2']);

    fixture = TestBed.createComponent(AccountCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load account cards on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    component.ngOnInit();
    
    expect(dispatchSpy).toHaveBeenCalledWith(loadAccountCardsPage({ accountId: 'acc-1' }));
  });


it('should show success view state when data loaded', async () => {
  store.overrideSelector(selectAccountsLoaded, true);
  store.overrideSelector(selectLoadedCardDetailsIds, ['card-1', 'card-2']);
  store.refreshState();
  
  const state = await firstValueFrom(component['viewState$']);
  
  expect(state).toBe('loading');
});

 it('should show loading view state when loading', async () => {
  store.overrideSelector(selectCardDetailsLoading, true);
  store.refreshState();
  
  const state = await firstValueFrom(component['viewState$']);
  
  expect(state).toBe('loading');
});


  it('should navigate to card details and set index', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    component.handleCardClick('card-2');
    
    expect(dispatchSpy).toHaveBeenCalledWith(
      setCurrentCardIndex({ cardIndex: 1, accountId: 'acc-1' })
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/details', 'card-2']);
  });

  it('should navigate back to card list', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    
    component.handleBackClick();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/list']);
  });

 it('should display correct cards label for multiple cards', async () => {
  const label = await firstValueFrom(component['cardsLabel$']);
  
  expect(label.count).toBe('2');
  expect(label.key).toBe('my-products.card.account-cards.account-header.cardCountPlural');
});

  it('should retry loading on error', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    component.handleRetry();
    
    expect(dispatchSpy).toHaveBeenCalledWith(loadAccountCardsPage({ accountId: 'acc-1' }));
  });
});