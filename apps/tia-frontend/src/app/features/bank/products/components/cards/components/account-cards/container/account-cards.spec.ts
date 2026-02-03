
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadAccountCardsPage } from '../../../../../../../../store/products/cards/cards.actions';
import { TranslateModule } from '@ngx-translate/core';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import {
  selectAllAccounts,
  selectCardDetailsByAccountId,
  selectCardDetailsLoading,
  selectCardDetailsError,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountCards } from '../../account-cards/container/account-cards';

describe('AccountCards', () => {
  let component: AccountCards;
  let fixture: ComponentFixture<AccountCards>;
  let store: { select: ReturnType<typeof vi.fn>; dispatch: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  const mockAccount: CardAccount = {
    id: 'acc-1',
    iban: 'GE123',
    name: 'Main',
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
      imageBase64: 'img1',
    },
  ];

  beforeEach(() => {
    store = { select: vi.fn(), dispatch: vi.fn() };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      imports: [AccountCards, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: store },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'acc-1' } } },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA], // ignore unknown child components
    });
  });

  function setupStore(
    accounts = [mockAccount],
    cards = mockCards,
    loading = false,
    error: string | null = null
  ) {
    store.select = vi.fn((selector) => {
      if (selector === selectAllAccounts) return of(accounts);
      if (selector === selectCardDetailsLoading) return of(loading);
      if (selector === selectCardDetailsError) return of(error);
      if (selector === selectCardDetailsByAccountId) return of(cards);
      return of(null);
    });
  }

  function createComponent() {
    fixture = TestBed.createComponent(AccountCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should dispatch loadAccountCardsPage on init', () => {
    setupStore();
    createComponent();
    expect(store.dispatch).toHaveBeenCalledWith(
      loadAccountCardsPage({ accountId: 'acc-1' })
    );
  });

  it('should navigate to card details on card click', () => {
    setupStore();
    createComponent();
    component.handleCardClick('card-1');
    expect(router.navigate).toHaveBeenCalledWith([
      '/bank/products/cards/details',
      'card-1',
    ]);
  });

  it('should emit success viewState', async () => {
    setupStore([mockAccount], mockCards, false, null);
    createComponent();
    const state = await firstValueFrom(component['viewState$']);
    expect(state).toBe('success');
  });

  it('should emit loading viewState', async () => {
    setupStore([mockAccount], mockCards, true, null);
    createComponent();
    const state = await firstValueFrom(component['viewState$']);
    expect(state).toBe('loading');
  });

  it('should emit error viewState', async () => {
    setupStore([mockAccount], mockCards, false, 'some error');
    createComponent();
    const state = await firstValueFrom(component['viewState$']);
    expect(state).toBe('error');
  });

  it('should emit no-account viewState when no accounts', async () => {
    setupStore([]);
    createComponent();
    const state = await firstValueFrom(component['viewState$']);
    expect(state).toBe('no-account');
  });

  it('should emit correct cardsLabel', async () => {
    setupStore([mockAccount], mockCards);
    createComponent();
    const label = await firstValueFrom(component['cardsLabel$']);
    expect(label).toBe('2 Cards');
  });

  it('should emit empty cardsLabel when no account', async () => {
    setupStore([]);
    createComponent();
    const label = await firstValueFrom(component['cardsLabel$']);
    expect(label).toBe('');
  });
});
