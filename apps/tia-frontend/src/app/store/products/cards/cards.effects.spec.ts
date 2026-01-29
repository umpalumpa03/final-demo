import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { CardsEffects } from './cards.effects';

import * as CardsActions from './cards.actions';

import { toArray } from 'rxjs/operators';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardListService } from '@tia/shared/services/cards/card-list.service';

describe('CardsEffects', () => {
  let actions$: Observable<Action>;
  let effects: CardsEffects;
  let cardListService: { 
    getCardAccounts: ReturnType<typeof vi.fn>; 
    getCardImage: ReturnType<typeof vi.fn>;
    getCardDetails: ReturnType<typeof vi.fn>;
  };

  const mockAccounts: CardAccount[] = [
    {
      id: 'acc1',
      iban: 'GE29TIA7890123456789012',
      name: 'Main GEL Account',
      balance: 4500000,
      currency: 'GEL',
      status: 'active',
      cardIds: ['card1'],
      openedAt: '2026-01-18T01:10:50.948Z',
    },
  ];

  const mockCardDetail: CardDetail = {
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

  beforeEach(() => {
    cardListService = {
      getCardAccounts: vi.fn(),
      getCardImage: vi.fn(),
      getCardDetails: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CardsEffects,
        provideMockActions(() => actions$),
        { provide: CardListService, useValue: cardListService },
      ],
    });

    effects = TestBed.inject(CardsEffects);
  });

  describe('loadCardAccounts$', () => {
    it('should return loadCardAccountsSuccess on success', async () => {
      cardListService.getCardAccounts.mockReturnValue(of(mockAccounts));
      actions$ = of(CardsActions.loadCardAccounts());

      const action = await firstValueFrom(effects.loadCardAccounts$);
      expect(action).toEqual(CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }));
    });

    it('should return loadCardAccountsFailure on error', async () => {
      const error = new Error('API Error');
      cardListService.getCardAccounts.mockReturnValue(throwError(() => error));
      actions$ = of(CardsActions.loadCardAccounts());

      const action = await firstValueFrom(effects.loadCardAccounts$);
      expect(action).toEqual(CardsActions.loadCardAccountsFailure({ error: error.message }));
    });
  });

  describe('loadCardImages$', () => {
    it('should return loadCardImageSuccess for each card', async () => {
      const imageBase64 = 'data:image/svg+xml;base64,test';
      cardListService.getCardImage.mockReturnValue(of(imageBase64));
      actions$ = of(CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }));

      const action = await firstValueFrom(effects.loadCardImages$);
      expect(action).toEqual(
        CardsActions.loadCardImageSuccess({ cardId: 'card1', imageBase64 })
      );
    });

    it('should return loadCardImageFailure on error', async () => {
      const error = new Error('Image load error');
      cardListService.getCardImage.mockReturnValue(throwError(() => error));
      actions$ = of(CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }));

      const action = await firstValueFrom(effects.loadCardImages$);
      expect(action).toEqual(
        CardsActions.loadCardImageFailure({ cardId: 'card1', error: 'IMAGE_LOAD_FAILED' })
      );
    });

    it('should handle multiple cards from multiple accounts', async () => {
      const multipleAccounts: CardAccount[] = [
        { ...mockAccounts[0], cardIds: ['card1', 'card2'] },
        { ...mockAccounts[0], id: 'acc2', cardIds: ['card3'] },
      ];

      const imageBase64 = 'data:image/svg+xml;base64,test';
      cardListService.getCardImage.mockReturnValue(of(imageBase64));
      actions$ = of(CardsActions.loadCardAccountsSuccess({ accounts: multipleAccounts }));

      const actions = await firstValueFrom(effects.loadCardImages$.pipe(toArray()));
      expect(actions.every(a => a.type.includes('[Cards] Load Card Image'))).toBe(true);
    });
  });

  describe('loadCardDetails$', () => {
    it('should return loadCardDetailsSuccess on success', async () => {
      cardListService.getCardDetails.mockReturnValue(of(mockCardDetail));
      actions$ = of(CardsActions.loadCardDetails({ cardId: 'card1' }));

      const action = await firstValueFrom(effects.loadCardDetails$);
      expect(action).toEqual(
        CardsActions.loadCardDetailsSuccess({ cardId: 'card1', details: mockCardDetail })
      );
    });

    it('should return loadCardDetailsFailure on error', async () => {
      const error = new Error('Details load error');
      cardListService.getCardDetails.mockReturnValue(throwError(() => error));
      actions$ = of(CardsActions.loadCardDetails({ cardId: 'card1' }));

      const action = await firstValueFrom(effects.loadCardDetails$);
      expect(action).toEqual(
        CardsActions.loadCardDetailsFailure({ cardId: 'card1', error: error.message })
      );
    });
  });
});