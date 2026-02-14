
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
import { selectAccountsLoaded, selectAllAccounts, selectOtpRemainingAttempts } from './cards.selectors';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

describe('CardsEffects', () => {
  let actions$: Observable<Action>;
  let effects: CardsEffects;
  let cardListApiService: {
    getCardAccounts: ReturnType<typeof vi.fn>;
    getCardDetails: ReturnType<typeof vi.fn>;
  };
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
  let store: { select: ReturnType<typeof vi.fn>; dispatch: ReturnType<typeof vi.fn> };
  let alertService: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    clearAlert: ReturnType<typeof vi.fn>;
  };
  let translateService: {
    instant: ReturnType<typeof vi.fn>;
  };

  const mockAccounts = [
    {
      id: 'acc-1',
      iban: 'GE123',
      name: 'Main',
      balance: 1000,
      currency: 'GEL',
      status: 'ACTIVE',
      cardIds: ['card-1'],
      openedAt: '2024-01-01',
    },
  ];

  const mockDetails = {
    id: 'card-1',
    accountId: 'acc-1',
    type: 'DEBIT' as const,
    network: 'VISA' as const,
    design: 'blue',
    cardName: 'My Card',
    status: 'ACTIVE' as const,
    allowOnlinePayments: true,
    allowInternational: true,
    allowAtm: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockRequest = {
    accountId: 'acc-1',
    design: 'blue',
    cardName: 'My Card',
    cardCategory: 'DEBIT' as const,
    cardType: 'VISA' as const,
  };

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
      verifyCardOtp: vi.fn(),
    };
    store = { select: vi.fn(() => of([])), dispatch: vi.fn() };
    alertService = {
      success: vi.fn(),
      error: vi.fn(),
      clearAlert: vi.fn(),
    };
    translateService = {
      instant: vi.fn((key: string) => key),
    };

    TestBed.configureTestingModule({
      providers: [
        CardsEffects,
        provideMockActions(() => actions$),
        { provide: CardListApiService, useValue: cardListApiService },
        { provide: CardsService, useValue: cardsService },
        { provide: Store, useValue: store },
        { provide: AlertService, useValue: alertService },
        { provide: TranslateService, useValue: translateService },
      ],
    });

    effects = TestBed.inject(CardsEffects);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should load card accounts successfully', async () => {
    store.select = vi.fn((selector) => {
      if (selector.name?.includes('selectAccountsLoaded')) return of(false);
      if (selector.name?.includes('selectAllAccounts')) return of([]);
      return of(null);
    });

    cardListApiService.getCardAccounts.mockReturnValue(of(mockAccounts));
    actions$ = of(CardsActions.loadCardAccounts({}));

    expect(await firstValueFrom(effects.loadCardAccounts$)).toEqual(
      CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }),
    );
  });

  it('should load card images', async () => {
    cardsService.getCardImage.mockReturnValue(of('base64img'));
    actions$ = of(
      CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }),
    );

    expect(await firstValueFrom(effects.loadCardImages$)).toEqual(
      CardsActions.loadCardImageSuccess({
        cardId: 'card-1',
        imageBase64: 'base64img',
      }),
    );
  });

  it('should load card details successfully', async () => {
    store.select = vi.fn((selector) => {
      if (selector.name?.includes('selectIsCardDetailLoaded')) return of(false);
      if (selector.name?.includes('selectCardDetails')) return of({});
      return of(null);
    });

    cardListApiService.getCardDetails.mockReturnValue(of(mockDetails));
    actions$ = of(CardsActions.loadCardDetails({ cardId: 'card-1' }));

    expect(await firstValueFrom(effects.loadCardDetails$)).toEqual(
      CardsActions.loadCardDetailsSuccess({
        cardId: 'card-1',
        details: mockDetails,
      }),
    );
  });

  it('should load card creation data successfully', async () => {
    store.select = vi.fn((selector) => {
      if (selector.name?.includes('selectCardCreationDataLoaded'))
        return of(false);
      if (selector.name?.includes('selectCardDesigns')) return of([]);
      if (selector.name?.includes('selectCardCategories')) return of([]);
      if (selector.name?.includes('selectCardTypes')) return of([]);
      return of(null);
    });

    cardsService.getCardDesigns.mockReturnValue(
      of([{ id: 'blue', designName: 'Blue', uri: 'uri1' }]),
    );
    cardsService.getCardCategories.mockReturnValue(
      of([{ value: 'DEBIT' as const, displayName: 'Debit' }]),
    );
    cardsService.getCardTypes.mockReturnValue(
      of([{ value: 'VISA' as const, displayName: 'Visa' }]),
    );
    actions$ = of(CardsActions.loadCardCreationData({}));

    expect(await firstValueFrom(effects.loadCardCreationData$)).toEqual(
      CardsActions.loadCardCreationDataSuccess({
        designs: [{ id: 'blue', designName: 'Blue', uri: 'uri1' }],
        categories: [{ value: 'DEBIT', displayName: 'Debit' }],
        types: [{ value: 'VISA', displayName: 'Visa' }],
      }),
    );
  });

  it('should create card successfully', async () => {
    cardsService.createCard.mockReturnValue(of({ success: true }));
    actions$ = of(CardsActions.createCard({ request: mockRequest }));

    expect(await firstValueFrom(effects.createCard$)).toEqual(
      CardsActions.createCardSuccess(),
    );
  });

  it('should reload accounts after card creation', async () => {
    actions$ = of(CardsActions.createCardSuccess());

    expect(await firstValueFrom(effects.createCardSuccess$)).toEqual(
      CardsActions.loadCardAccounts({ forceRefresh: true }),
    );
  });

  it('should load account cards page', async () => {
    store.select.mockReturnValue(of([]));
    actions$ = of(CardsActions.loadAccountCardsPage({ accountId: 'acc-1' }));

    expect(await firstValueFrom(effects.loadAccountCardsPage$)).toEqual(
      CardsActions.loadCardAccounts({}),
    );
  });

  it('should load creation data when modal opens', async () => {
    actions$ = of(CardsActions.openCreateCardModal());

    expect(
      await firstValueFrom(effects.loadCardCreationDataOnModalOpen$),
    ).toEqual(CardsActions.loadCardCreationData({}));
  });

  it('should update card name successfully', async () => {
    cardsService.updateCardName.mockReturnValue(of({ success: true }));
    actions$ = of(
      CardsActions.updateCardName({ cardId: 'card-1', cardName: 'New Name' }),
    );

    expect(await firstValueFrom(effects.updateCardName$)).toEqual(
      CardsActions.updateCardNameSuccess({
        cardId: 'card-1',
        cardName: 'New Name',
      }),
    );
  });

  it('should request card OTP successfully', async () => {
    const mockResponse = { challengeId: 'ch-123', method: 'sms' };
    cardsService.requestCardOtp.mockReturnValue(of(mockResponse));
    actions$ = of(CardsActions.requestCardOtp({ cardId: 'card-1' }));

    expect(await firstValueFrom(effects.requestCardOtp$)).toEqual(
      CardsActions.requestCardOtpSuccess({ challengeId: 'ch-123' }),
    );
  });

  it('should verify card OTP successfully', async () => {
    const mockData = {
      cardNumber: '1234',
      cvv: '123',
      expiryDate: '12/28',
      cardholderName: 'John',
    };
    cardsService.verifyCardOtp.mockReturnValue(of(mockData));
    actions$ = of(
      CardsActions.verifyCardOtp({
        challengeId: 'ch-1',
        code: '1111',
        cardId: 'card-1',
      }),
    );

    expect(await firstValueFrom(effects.verifyCardOtp$)).toEqual(
      CardsActions.verifyCardOtpSuccess({
        cardId: 'card-1',
        sensitiveData: mockData,
      }),
    );
  });

  it('should dispatch requestCardOtp when modal opens', async () => {
    actions$ = of(CardsActions.openCardOtpModal({ cardId: 'card-1' }));

    expect(await firstValueFrom(effects.openCardOtpModal$)).toEqual(
      CardsActions.requestCardOtp({ cardId: 'card-1' }),
    );
  });

  it('should show alert on card creation success', async () => {
    actions$ = of(CardsActions.createCardSuccess());
    await firstValueFrom(effects.createCardSuccessAlert$);
    expect(alertService.success).toHaveBeenCalled();
  });

  it('should show alert on OTP sent', async () => {
    actions$ = of(
      CardsActions.requestCardOtpSuccess({ challengeId: 'ch-1' }),
    );
    await firstValueFrom(effects.showOtpSentAlert$);
    expect(alertService.success).toHaveBeenCalled();
  });

  it('should show alert on OTP verified', async () => {
    const mockData = {
      cardNumber: '1234',
      cvv: '123',
      expiryDate: '12/28',
      cardholderName: 'John',
    };
    actions$ = of(
      CardsActions.verifyCardOtpSuccess({
        cardId: 'card-1',
        sensitiveData: mockData,
      }),
    );
    await firstValueFrom(effects.showOtpVerifiedAlert$);
    expect(alertService.success).toHaveBeenCalled();
  });

  it('should show error alert on OTP failure', async () => {
    store.select = vi.fn((selector) => {
      if (selector === selectOtpRemainingAttempts) return of(2);
      return of(null);
    });

    actions$ = of(CardsActions.verifyCardOtpFailure({ error: 'Failed' }));
    await firstValueFrom(effects.showOtpErrorAlert$);
    expect(alertService.error).toHaveBeenCalled();
  });

  it('should close modal when OTP attempts reach 0', async () => {
    store.select = vi.fn((selector) => {
      if (selector === selectOtpRemainingAttempts) return of(0);
      return of(null);
    });

    actions$ = of(CardsActions.verifyCardOtpFailure({ error: 'Failed' }));
    await firstValueFrom(effects.showOtpErrorAlert$);
    expect(store.dispatch).toHaveBeenCalledWith(
      CardsActions.closeCardOtpModal(),
    );
  });
});