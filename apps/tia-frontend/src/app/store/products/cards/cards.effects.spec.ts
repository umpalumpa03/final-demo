import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Action } from '@ngrx/store';
import { CardsEffects } from './cards.effects';
import { CardListService } from '@tia/shared/services/cards/card-list.service';
import * as CardsActions from './cards.actions';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardDesign } from '@tia/shared/models/cards/card-design.model';
import { CardCategory } from '@tia/shared/models/cards/card-category.model';
import { CardType } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-type.model';

describe('CardsEffects', () => {
  let actions$: Observable<Action>;
  let effects: CardsEffects;
  let service: CardListService;
  let store: Store;

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

  const mockCardDetail: CardDetail = {
    id: 'card1',
    accountId: 'acc1',
    type: 'DEBIT' as const,
    network: 'VISA' as const,
    design: 'MIDNIGHT_GRADIENT',
    cardName: 'Main Visa',
    status: 'ACTIVE' as const,
    allowOnlinePayments: true,
    allowInternational: true,
    allowAtm: true,
    createdAt: '2026-01-18T01:10:50.948Z',
    updatedAt: '2026-01-18T01:10:50.948Z',
  };

  const mockDesigns: CardDesign[] = [
    { id: 'design-1', designName: 'Classic', uri: '/designs/classic.png' },
  ];
  const mockCategories: CardCategory[] = [
    { value: 'DEBIT' as const, displayName: 'Debit Card' },
  ];
  const mockTypes: CardType[] = [
    { value: 'VISA' as const, displayName: 'Visa' },
  ];

  beforeEach(() => {
    const serviceMock = {
      getCardAccounts: vi.fn(),
      getCardImage: vi.fn(),
      getCardDetails: vi.fn(),
      getCardDesigns: vi.fn(),
      getCardCategories: vi.fn(),
      getCardTypes: vi.fn(),
      createCard: vi.fn(),
    };

    const storeMock = {
      select: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CardsEffects,
        provideMockActions(() => actions$),
        { provide: CardListService, useValue: serviceMock },
        { provide: Store, useValue: storeMock },
      ],
    });

    effects = TestBed.inject(CardsEffects);
    service = TestBed.inject(CardListService);
    store = TestBed.inject(Store);
  });

  describe('loadCardAccounts$', () => {
    it('should return loadCardAccountsSuccess on success', () => {
      vi.spyOn(service, 'getCardAccounts').mockReturnValue(of(mockAccounts));
      actions$ = of(CardsActions.loadCardAccounts());

      let result: Action | undefined;
      effects.loadCardAccounts$.subscribe((action) => (result = action));
      expect(result).toEqual(
        CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }),
      );
    });

    it('should return loadCardAccountsFailure on error', () => {
      vi.spyOn(service, 'getCardAccounts').mockReturnValue(
        throwError(() => new Error('Error')),
      );
      actions$ = of(CardsActions.loadCardAccounts());

      let result: Action | undefined;
      effects.loadCardAccounts$.subscribe((action) => (result = action));
      expect(result).toEqual(
        CardsActions.loadCardAccountsFailure({ error: 'Error' }),
      );
    });
  });

  describe('loadCardImages$', () => {
    it('should return loadCardImageSuccess for all card images', () => {
      vi.spyOn(service, 'getCardImage').mockReturnValue(of('base64image'));
      actions$ = of(
        CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }),
      );

      const results: Action[] = [];
      effects.loadCardImages$.subscribe((action) => results.push(action));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(
        CardsActions.loadCardImageSuccess({
          cardId: 'card1',
          imageBase64: 'base64image',
        }),
      );
      expect(results[1]).toEqual(
        CardsActions.loadCardImageSuccess({
          cardId: 'card2',
          imageBase64: 'base64image',
        }),
      );
    });

    it('should return loadCardImageFailure on error', () => {
      vi.spyOn(service, 'getCardImage').mockReturnValue(
        throwError(() => new Error('Error')),
      );
      actions$ = of(
        CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }),
      );

      const results: Action[] = [];
      effects.loadCardImages$.subscribe((action) => results.push(action));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(
        CardsActions.loadCardImageFailure({
          cardId: 'card1',
          error: 'IMAGE_LOAD_FAILED',
        }),
      );
      expect(results[1]).toEqual(
        CardsActions.loadCardImageFailure({
          cardId: 'card2',
          error: 'IMAGE_LOAD_FAILED',
        }),
      );
    });
  });

  describe('loadCardDetails$', () => {
    it('should return loadCardDetailsSuccess on success', () => {
      vi.spyOn(service, 'getCardDetails').mockReturnValue(of(mockCardDetail));
      actions$ = of(CardsActions.loadCardDetails({ cardId: 'card1' }));

      let result: Action | undefined;
      effects.loadCardDetails$.subscribe((action) => (result = action));
      expect(result).toEqual(
        CardsActions.loadCardDetailsSuccess({
          cardId: 'card1',
          details: mockCardDetail,
        }),
      );
    });

    it('should return loadCardDetailsFailure on error', () => {
      vi.spyOn(service, 'getCardDetails').mockReturnValue(
        throwError(() => new Error('Error')),
      );
      actions$ = of(CardsActions.loadCardDetails({ cardId: 'card1' }));

      let result: Action | undefined;
      effects.loadCardDetails$.subscribe((action) => (result = action));
      expect(result).toEqual(
        CardsActions.loadCardDetailsFailure({
          cardId: 'card1',
          error: 'Error',
        }),
      );
    });
  });

  describe('loadCardCreationData$', () => {
    it('should return loadCardCreationDataSuccess on success', () => {
      vi.spyOn(service, 'getCardDesigns').mockReturnValue(of(mockDesigns));
      vi.spyOn(service, 'getCardCategories').mockReturnValue(
        of(mockCategories),
      );
      vi.spyOn(service, 'getCardTypes').mockReturnValue(of(mockTypes));
      actions$ = of(CardsActions.loadCardCreationData());

      let result: Action | undefined;
      effects.loadCardCreationData$.subscribe((action) => (result = action));
      expect(result).toEqual(
        CardsActions.loadCardCreationDataSuccess({
          designs: mockDesigns,
          categories: mockCategories,
          types: mockTypes,
        }),
      );
    });

    it('should return loadCardCreationDataFailure on error', () => {
      vi.spyOn(service, 'getCardDesigns').mockReturnValue(
        throwError(() => new Error('Error')),
      );
      vi.spyOn(service, 'getCardCategories').mockReturnValue(
        of(mockCategories),
      );
      vi.spyOn(service, 'getCardTypes').mockReturnValue(of(mockTypes));
      actions$ = of(CardsActions.loadCardCreationData());

      let result: Action | undefined;
      effects.loadCardCreationData$.subscribe((action) => (result = action));
      expect(result).toEqual(
        CardsActions.loadCardCreationDataFailure({ error: 'Error' }),
      );
    });
  });

  describe('createCard$', () => {
    it('should return createCardSuccess on success', () => {
      const request = {
        accountId: 'acc1',
        design: 'design-1',
        cardName: 'My Card',
        cardCategory: 'DEBIT' as const,
        cardType: 'VISA' as const,
      };
      vi.spyOn(service, 'createCard').mockReturnValue(of({ success: true }));
      actions$ = of(CardsActions.createCard({ request }));

      let result: Action | undefined;
      effects.createCard$.subscribe((action) => (result = action));
      expect(result).toEqual(CardsActions.createCardSuccess());
    });

    it('should return createCardFailure on error', () => {
      const request = {
        accountId: 'acc1',
        design: 'design-1',
        cardName: 'My Card',
        cardCategory: 'DEBIT' as const,
        cardType: 'VISA' as const,
      };
      vi.spyOn(service, 'createCard').mockReturnValue(
        throwError(() => new Error('Error')),
      );
      actions$ = of(CardsActions.createCard({ request }));

      let result: Action | undefined;
      effects.createCard$.subscribe((action) => (result = action));
      expect(result).toEqual(
        CardsActions.createCardFailure({ error: 'Error' }),
      );
    });
  });

  describe('createCardSuccess$', () => {
    it('should return loadCardAccounts', () => {
      actions$ = of(CardsActions.createCardSuccess());

      let result: Action | undefined;
      effects.createCardSuccess$.subscribe((action) => (result = action));
      expect(result).toEqual(CardsActions.loadCardAccounts());
    });
  });

  describe('loadAccountCardsPage$', () => {
    it('should dispatch loadCardAccounts when no accounts exist', () => {
      vi.spyOn(store, 'select').mockReturnValue(of([]));
      actions$ = of(CardsActions.loadAccountCardsPage({ accountId: 'acc1' }));

      const results: Action[] = [];
      effects.loadAccountCardsPage$.subscribe((action) => results.push(action));

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(CardsActions.loadCardAccounts());
    });

    it('should dispatch loadCardDetails for each card when account exists', () => {
      vi.spyOn(store, 'select').mockReturnValue(of(mockAccounts));
      actions$ = of(CardsActions.loadAccountCardsPage({ accountId: 'acc1' }));

      const results: Action[] = [];
      effects.loadAccountCardsPage$.subscribe((action) => results.push(action));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(
        CardsActions.loadCardDetails({ cardId: 'card1' }),
      );
      expect(results[1]).toEqual(
        CardsActions.loadCardDetails({ cardId: 'card2' }),
      );
    });
  });
});
