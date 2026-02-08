
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
    updateCardName: ReturnType<typeof vi.fn>;
    requestCardOtp: ReturnType<typeof vi.fn>;
    verifyCardOtp: ReturnType<typeof vi.fn>;
  };
  let store: { select: ReturnType<typeof vi.fn> };

  const mockAccounts = [
    { id: 'acc-1', iban: 'GE123', name: 'Main', balance: 1000, currency: 'GEL', status: 'ACTIVE', cardIds: ['card-1'], openedAt: '2024-01-01' },
  ];

  const mockDetails = {
    id: 'card-1', accountId: 'acc-1', type: 'DEBIT' as const, network: 'VISA' as const,
    design: 'blue', cardName: 'My Card', status: 'ACTIVE' as const,
    allowOnlinePayments: true, allowInternational: true, allowAtm: true,
    createdAt: '2024-01-01', updatedAt: '2024-01-01',
  };

  const mockRequest = { accountId: 'acc-1', design: 'blue', cardName: 'My Card', cardCategory: 'DEBIT' as const, cardType: 'VISA' as const };

  beforeEach(() => {
    cardListApiService = { getCardAccounts: vi.fn(), getCardDetails: vi.fn() };
    cardsService = { 
      getCardImage: vi.fn(), 
      getCardDesigns: vi.fn(), 
      getCardCategories: vi.fn(), 
      getCardTypes: vi.fn(), 
      createCard: vi.fn(),
      updateCardName: vi.fn(),
      requestCardOtp: vi.fn(),
      verifyCardOtp: vi.fn()
    };
    store = { select: vi.fn(() => of([])) };

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

  afterEach(() => vi.useRealTimers());

  it('should load card accounts successfully', async () => {
    cardListApiService.getCardAccounts.mockReturnValue(of(mockAccounts));
    actions$ = of(CardsActions.loadCardAccounts());

    expect(await firstValueFrom(effects.loadCardAccounts$)).toEqual(CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }));
  });

  it('should handle card accounts load failure', async () => {
    cardListApiService.getCardAccounts.mockReturnValue(throwError(() => new Error('Load failed')));
    actions$ = of(CardsActions.loadCardAccounts());

    expect(await firstValueFrom(effects.loadCardAccounts$)).toEqual(CardsActions.loadCardAccountsFailure({ error: 'Load failed' }));
  });

  it('should load card images on accounts success', async () => {
    cardsService.getCardImage.mockReturnValue(of('base64img'));
    actions$ = of(CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }));

    expect(await firstValueFrom(effects.loadCardImages$)).toEqual(CardsActions.loadCardImageSuccess({ cardId: 'card-1', imageBase64: 'base64img' }));
  });

  it('should load card details successfully', async () => {
    cardListApiService.getCardDetails.mockReturnValue(of(mockDetails));
    actions$ = of(CardsActions.loadCardDetails({ cardId: 'card-1' }));

    expect(await firstValueFrom(effects.loadCardDetails$)).toEqual(CardsActions.loadCardDetailsSuccess({ cardId: 'card-1', details: mockDetails }));
  });

  it('should handle card details failure', async () => {
    cardListApiService.getCardDetails.mockReturnValue(throwError(() => new Error('Details failed')));
    actions$ = of(CardsActions.loadCardDetails({ cardId: 'card-1' }));

    expect(await firstValueFrom(effects.loadCardDetails$)).toEqual(CardsActions.loadCardDetailsFailure({ cardId: 'card-1', error: 'Details failed' }));
  });

  it('should load card creation data successfully', async () => {
    cardsService.getCardDesigns.mockReturnValue(of([{ id: 'blue', designName: 'Blue', uri: 'uri1' }]));
    cardsService.getCardCategories.mockReturnValue(of([{ value: 'DEBIT' as const, displayName: 'Debit' }]));
    cardsService.getCardTypes.mockReturnValue(of([{ value: 'VISA' as const, displayName: 'Visa' }]));
    actions$ = of(CardsActions.loadCardCreationData());

    expect(await firstValueFrom(effects.loadCardCreationData$)).toEqual(CardsActions.loadCardCreationDataSuccess({
      designs: [{ id: 'blue', designName: 'Blue', uri: 'uri1' }],
      categories: [{ value: 'DEBIT', displayName: 'Debit' }],
      types: [{ value: 'VISA', displayName: 'Visa' }],
    }));
  });

  it('should create card successfully', async () => {
    cardsService.createCard.mockReturnValue(of({ success: true }));
    actions$ = of(CardsActions.createCard({ request: mockRequest }));

    expect(await firstValueFrom(effects.createCard$)).toEqual(CardsActions.createCardSuccess());
  });

  it('should handle create card failure', async () => {
    cardsService.createCard.mockReturnValue(throwError(() => new Error('Create failed')));
    actions$ = of(CardsActions.createCard({ request: mockRequest }));

    expect(await firstValueFrom(effects.createCard$)).toEqual(CardsActions.createCardFailure({ error: 'Create failed' }));
  });

  it('should reload accounts after card creation success', async () => {
    actions$ = of(CardsActions.createCardSuccess());

    expect(await firstValueFrom(effects.createCardSuccess$)).toEqual(CardsActions.loadCardAccounts());
  });

  it('should dispatch loadCardAccounts when store has no accounts', async () => {
    store.select.mockReturnValue(of([]));
    actions$ = of(CardsActions.loadAccountCardsPage({ accountId: 'acc-1' }));

    expect(await firstValueFrom(effects.loadAccountCardsPage$)).toEqual(CardsActions.loadCardAccounts());
  });

  it('should dispatch loadCardDetails for each cardId', async () => {
    store.select.mockReturnValue(of([{ ...mockAccounts[0], cardIds: ['card-1', 'card-2'] }]));
    actions$ = of(CardsActions.loadAccountCardsPage({ accountId: 'acc-1' }));

    const results: Action[] = [];
    await new Promise<void>((resolve) => {
      effects.loadAccountCardsPage$.subscribe({ next: (a) => results.push(a), complete: resolve });
    });

    expect(results).toEqual([
      CardsActions.loadCardDetails({ cardId: 'card-1' }),
      CardsActions.loadCardDetails({ cardId: 'card-2' }),
    ]);
  });

  it('should dispatch hideSuccessAlert after delay', async () => {
    vi.useFakeTimers();
    actions$ = of(CardsActions.createCardSuccess());

    const resultPromise = firstValueFrom(effects.hideSuccessAlertAfterDelay$);
    vi.advanceTimersByTime(5000);

    expect(await resultPromise).toEqual(CardsActions.hideSuccessAlert());
  });

  it('should load creation data when modal opens', async () => {
    actions$ = of(CardsActions.openCreateCardModal());

    expect(await firstValueFrom(effects.loadCardCreationDataOnModalOpen$)).toEqual(CardsActions.loadCardCreationData());
  });

  it('should handle image load failure in loadCardImages$', async () => {
    cardsService.getCardImage.mockReturnValue(throwError(() => new Error('Image failed')));
    actions$ = of(CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }));

    expect(await firstValueFrom(effects.loadCardImages$)).toEqual(
      CardsActions.loadCardImageFailure({ cardId: 'card-1', error: 'IMAGE_LOAD_FAILED' })
    );
  });

  it('should handle card creation data failure', async () => {
    cardsService.getCardDesigns.mockReturnValue(throwError(() => new Error('Failed')));
    actions$ = of(CardsActions.loadCardCreationData());

    expect(await firstValueFrom(effects.loadCardCreationData$)).toEqual(
      CardsActions.loadCardCreationDataFailure({ error: 'Failed' })
    );
  });




  it('should dispatch loadCardImagesComplete when no cardIds', async () => {
    const emptyAccounts = [{ ...mockAccounts[0], cardIds: [] }];
    actions$ = of(CardsActions.loadCardAccountsSuccess({ accounts: emptyAccounts }));

    expect(await firstValueFrom(effects.loadCardImages$)).toEqual(
      CardsActions.loadCardImagesComplete()
    );
  });

  it('should dispatch loadCardImagesComplete after all images loaded', async () => {
    cardsService.getCardImage.mockReturnValue(of('base64img'));
    actions$ = of(CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }));

    const results: any[] = [];
    await new Promise<void>((resolve) => {
      effects.loadCardImages$.subscribe({
        next: (action) => results.push(action),
        complete: resolve,
      });
    });

    expect(results).toContainEqual(CardsActions.loadCardImagesComplete());
  });

  it('should update card name successfully', async () => {
    cardsService.updateCardName.mockReturnValue(of({ success: true }));
    actions$ = of(CardsActions.updateCardName({ cardId: 'card-1', cardName: 'New Name' }));

    expect(await firstValueFrom(effects.updateCardName$)).toEqual(
      CardsActions.updateCardNameSuccess({ cardId: 'card-1', cardName: 'New Name' })
    );
  });

  it('should handle update card name failure', async () => {
    cardsService.updateCardName.mockReturnValue(throwError(() => new Error('Update failed')));
    actions$ = of(CardsActions.updateCardName({ cardId: 'card-1', cardName: 'New Name' }));

    expect(await firstValueFrom(effects.updateCardName$)).toEqual(
      CardsActions.updateCardNameFailure({ cardId: 'card-1', error: 'Update failed' })
    );
  });

  it('should request card OTP successfully', async () => {
    const mockResponse = { challengeId: 'ch-123', method: 'sms' };
    cardsService.requestCardOtp.mockReturnValue(of(mockResponse));
    actions$ = of(CardsActions.requestCardOtp({ cardId: 'card-1' }));

    expect(await firstValueFrom(effects.requestCardOtp$)).toEqual(
      CardsActions.requestCardOtpSuccess({ challengeId: 'ch-123' })
    );
  });

  it('should handle request card OTP failure', async () => {
    cardsService.requestCardOtp.mockReturnValue(throwError(() => new Error('Failed')));
    actions$ = of(CardsActions.requestCardOtp({ cardId: 'card-1' }));

    expect(await firstValueFrom(effects.requestCardOtp$)).toEqual(
      CardsActions.requestCardOtpFailure({ error: 'Failed' })
    );
  });

  it('should verify card OTP successfully', async () => {
    const mockData = { cardNumber: '1234', cvv: '123', expiryDate: '12/28', cardholderName: 'John' };
    cardsService.verifyCardOtp.mockReturnValue(of(mockData));
    actions$ = of(CardsActions.verifyCardOtp({ challengeId: 'ch-1', code: '1111', cardId: 'card-1' }));

    expect(await firstValueFrom(effects.verifyCardOtp$)).toEqual(
      CardsActions.verifyCardOtpSuccess({ cardId: 'card-1', sensitiveData: mockData })
    );
  });

  it('should handle verify card OTP failure', async () => {
    cardsService.verifyCardOtp.mockReturnValue(throwError(() => new Error('Invalid')));
    actions$ = of(CardsActions.verifyCardOtp({ challengeId: 'ch-1', code: '1111', cardId: 'card-1' }));

    expect(await firstValueFrom(effects.verifyCardOtp$)).toEqual(
      CardsActions.verifyCardOtpFailure({ error: 'Invalid' })
    );
  });

  it('should dispatch requestCardOtp when modal opens', async () => {
    actions$ = of(CardsActions.openCardOtpModal({ cardId: 'card-1' }));

    expect(await firstValueFrom(effects.openCardOtpModal$)).toEqual(
      CardsActions.requestCardOtp({ cardId: 'card-1' })
    );
  });
});