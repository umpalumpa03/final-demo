import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CardsEffects } from './cards.effects';
import * as CardsActions from './cards.actions';
import { CardListApiService } from '@tia/shared/services/cards/card-list.service.api';
import { CardsService } from '../../../features/bank/products/components/cards/service/cards.service';
import { firstValueFrom } from 'rxjs';

describe('CardsEffects', () => {
  let actions$: Observable<Action>;
  let effects: CardsEffects;
  let cardListApiService: { getCardAccounts: ReturnType<typeof vi.fn>; getCardDetails: ReturnType<typeof vi.fn> };
  let cardsService: { 
    getCardImage: ReturnType<typeof vi.fn>;
    getCardDesigns: ReturnType<typeof vi.fn>;
    getCardCategories: ReturnType<typeof vi.fn>;
    getCardTypes: ReturnType<typeof vi.fn>;
    createCard: ReturnType<typeof vi.fn>;
  };
  let store: { select: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    cardListApiService = {
      getCardAccounts: vi.fn(),
      getCardDetails: vi.fn(),
    };

    cardsService = {
      getCardImage: vi.fn(),
      getCardDesigns: vi.fn(),
      getCardCategories: vi.fn(),
      getCardTypes: vi.fn(),
      createCard: vi.fn(),
    };

    store = {
      select: vi.fn(() => of([])),
    };

    TestBed.configureTestingModule({
      providers: [
        CardsEffects,
        provideMockActions(() => actions$),
        { provide: CardListApiService, useValue: cardListApiService },
        { provide: CardsService, useValue: cardsService },
        { provide: Store, useValue: store },
      ],
    });

    effects = TestBed.inject(CardsEffects);
  });

  it('should load card accounts successfully', async () => {
    const mockAccounts = [
      { id: 'acc-1', iban: 'GE123', name: 'Main', balance: 1000, currency: 'GEL', status: 'ACTIVE', cardIds: [], openedAt: '2024-01-01' },
    ];
    cardListApiService.getCardAccounts.mockReturnValue(of(mockAccounts));

    actions$ = of(CardsActions.loadCardAccounts());

    const result = await firstValueFrom(effects.loadCardAccounts$);
    expect(result).toEqual(CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }));
  });

  it('should handle card accounts load failure', async () => {
    cardListApiService.getCardAccounts.mockReturnValue(throwError(() => new Error('Load failed')));

    actions$ = of(CardsActions.loadCardAccounts());

    const result = await firstValueFrom(effects.loadCardAccounts$);
    expect(result).toEqual(CardsActions.loadCardAccountsFailure({ error: 'Load failed' }));
  });

  it('should load card creation data successfully', async () => {
    const mockData = {
      designs: [{ id: 'blue', designName: 'Blue', uri: 'uri1' }],
      categories: [{ value: 'DEBIT' as const, displayName: 'Debit' }],
      types: [{ value: 'VISA' as const, displayName: 'Visa' }],
    };
    cardsService.getCardDesigns.mockReturnValue(of(mockData.designs));
    cardsService.getCardCategories.mockReturnValue(of(mockData.categories));
    cardsService.getCardTypes.mockReturnValue(of(mockData.types));

    actions$ = of(CardsActions.loadCardCreationData());

    const result = await firstValueFrom(effects.loadCardCreationData$);
    expect(result).toEqual(CardsActions.loadCardCreationDataSuccess(mockData));
  });

  it('should create card successfully', async () => {
    const mockRequest = {
      accountId: 'acc-1',
      design: 'blue',
      cardName: 'My Card',
      cardCategory: 'DEBIT' as const,
      cardType: 'VISA' as const,
    };
    cardsService.createCard.mockReturnValue(of({ success: true }));

    actions$ = of(CardsActions.createCard({ request: mockRequest }));

    const result = await firstValueFrom(effects.createCard$);
    expect(result).toEqual(CardsActions.createCardSuccess());
  });

  it('should reload accounts after card creation success', async () => {
    actions$ = of(CardsActions.createCardSuccess());

    const result = await firstValueFrom(effects.createCardSuccess$);
    expect(result).toEqual(CardsActions.loadCardAccounts());
  });

  it('should load creation data when modal opens', async () => {
    actions$ = of(CardsActions.openCreateCardModal());

    const result = await firstValueFrom(effects.loadCardCreationDataOnModalOpen$);
    expect(result).toEqual(CardsActions.loadCardCreationData());
  });
});