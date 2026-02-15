import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { CardDetails } from '../../components/cards/components/card-details/container/card-details';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { selectAllAccounts, selectCardDetails, selectCardImages, selectCurrentAccountCardIds, selectCurrentCardIndex, selectIsCardDetailsModalOpen } from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import { loadCardAccounts, loadCardDetails, navigateToNextCard, navigateToPreviousCard, openCardDetailsModal } from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';


describe('CardDetails Integration', () => {
  let component: CardDetails
  let fixture: ComponentFixture<CardDetails>;
  let store: MockStore;
  let router: Router;
  let paramMapSubject: BehaviorSubject<any>;

  const mockCardDetails = {
    'card-1': {
      id: 'card-1',
      accountId: 'acc-1',
      type: 'CREDIT' as const,
      network: 'VISA' as const,
      design: 'blue',
      cardName: 'My Card',
      status: 'ACTIVE' as const,
      allowOnlinePayments: true,
      allowInternational: true,
      allowAtm: true,
      creditLimit: 5000,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  };

  const mockAccount = {
    id: 'acc-1',
    iban: 'GE00TB0000000000000000',
    name: 'Main Account',
    balance: 1000,
    currency: 'GEL',
    status: 'ACTIVE',
    cardIds: ['card-1', 'card-2', 'card-3'],
    openedAt: '2024-01-01',
  };

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject({
      get: (key: string) => (key === 'cardId' ? 'card-1' : null),
    });

    await TestBed.configureTestingModule({
      imports: [CardDetails, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            cards: {
              cardDetails: mockCardDetails,
              cardImages: { 'card-1': 'base64-image' },
              accounts: [mockAccount],
              currentCardIndex: 0,
              currentAccountId: 'acc-1',
              isCardDetailsModalOpen: false,
            },
          },
        }),
        { provide: Router, useValue: { navigate: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: vi.fn().mockReturnValue('card-1') } },
            paramMap: paramMapSubject.asObservable(),
          },
        },
        {
          provide: AlertService,
          useValue: {
            isVisible: vi.fn().mockReturnValue(false),
            alertType: vi.fn().mockReturnValue(null),
            alertMessage: vi.fn().mockReturnValue(''),
            success: vi.fn(),
            error: vi.fn(),
            clearAlert: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    store.overrideSelector(selectCardDetails, mockCardDetails);
    store.overrideSelector(selectCardImages, { 'card-1': 'base64-image' });
    store.overrideSelector(selectAllAccounts, [mockAccount]);
    store.overrideSelector(selectCurrentCardIndex, 0);
    store.overrideSelector(selectCurrentAccountCardIds, ['card-1', 'card-2', 'card-3']);
    store.overrideSelector(selectIsCardDetailsModalOpen, false);

    fixture = TestBed.createComponent(CardDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load card data on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    component.ngOnInit();
    
    expect(dispatchSpy).toHaveBeenCalledWith(loadCardAccounts({}));
    expect(dispatchSpy).toHaveBeenCalledWith(loadCardDetails({ cardId: 'card-1' }));
  });

  it('should display card data with formatted values', async () => {
    const data = await firstValueFrom(component['cardData$']);
    
    expect(data).not.toBeNull();
    expect(data?.cardId).toBe('card-1');
    expect(data?.details.cardName).toBe('My Card');
    expect(data?.currency).toBe('GEL');
    expect(data?.formattedBalance).toBe('GEL 1000');
    expect(data?.shouldShowCreditLimit).toBe(true);
    expect(data?.formattedCreditLimit).toBe('GEL 5000');
  });

  it('should navigate to transactions page', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    
    component['handleViewTransactions']();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/transactions', 'card-1']);
  });

  it('should open card details modal', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    component['handleOpenDetailsModal']();
    
    expect(dispatchSpy).toHaveBeenCalledWith(openCardDetailsModal({ cardId: 'card-1' }));
  });

  it('should navigate to next card', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const navigateSpy = vi.spyOn(router, 'navigate');
    
    store.overrideSelector(selectCurrentCardIndex, 1);
    store.refreshState();
    
    component['handleNextCard']();
    
    expect(dispatchSpy).toHaveBeenCalledWith(navigateToNextCard());
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/details', 'card-2']);
  });

  it('should navigate to previous card', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const navigateSpy = vi.spyOn(router, 'navigate');
    
    store.overrideSelector(selectCurrentCardIndex, 2);
    store.refreshState();
    
    component['handlePreviousCard']();
    
    expect(dispatchSpy).toHaveBeenCalledWith(navigateToPreviousCard());
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/details', 'card-3']);
  });

  it('should navigate back to account page with multiple cards', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    
    component['handleBack']();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/account', 'acc-1']);
  });

  it('should navigate back to list with single card', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    
    store.overrideSelector(selectAllAccounts, [{ ...mockAccount, cardIds: ['card-1'] }]);
    store.refreshState();
    
    component['handleBack']();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards']);
  });

  it('should determine hasMultipleCards correctly', async () => {
    const hasMultiple = await firstValueFrom(component['hasMultipleCards$']);
    
    expect(hasMultiple).toBe(true);
  });
});