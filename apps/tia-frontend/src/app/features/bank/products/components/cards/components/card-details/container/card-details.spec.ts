import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CardDetails } from './card-details';
import {
  loadCardDetails,
  loadCardAccounts,
  openCardDetailsModal,
  closeCardDetailsModal,
  navigateToNextCard,
  navigateToPreviousCard,
} from '../../../../../../../../store/products/cards/cards.actions';
import * as CardsSelectors from '../../../../../../../../store/products/cards/cards.selectors';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { TranslateModule } from '@ngx-translate/core';

interface MockStore {
  select: Mock;
  dispatch: Mock;
}

interface MockRouter {
  navigate: Mock;
}

describe('CardDetails', () => {
  let component: CardDetails;
  let fixture: ComponentFixture<CardDetails>;
  let store: MockStore;
  let router: MockRouter;
  let paramMapSubject: BehaviorSubject<any>;

  const mockCardId = 'card-123';
  const mockCardDetails: Record<string, CardDetail> = {
    'card-123': {
      id: 'card-123',
      accountId: 'acc-123',
      type: 'DEBIT' as const,
      network: 'VISA' as const,
      design: 'design-1',
      cardName: 'My Card',
      status: 'ACTIVE' as const,
      allowOnlinePayments: true,
      allowInternational: true,
      allowAtm: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  };

  const mockCardImages: Record<string, string> = {
    'card-123': 'data:image/png;base64,abc123',
  };

  const mockAccount: CardAccount = {
    id: 'acc-123',
    iban: 'GE00TB0000000000000000',
    name: 'My Account',
    balance: 1000,
    currency: 'GEL',
    status: 'ACTIVE',
    cardIds: ['card-123'],
    openedAt: '2024-01-01',
  };

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject({
      get: (key: string) => (key === 'cardId' ? mockCardId : null),
    });

    const storeMock: MockStore = {
      select: vi.fn((selector) => {
        if (selector === CardsSelectors.selectCardDetails) return of(mockCardDetails);
        if (selector === CardsSelectors.selectCardImages) return of(mockCardImages);
        if (selector === CardsSelectors.selectCardDetailsLoading) return of(false);
        if (selector === CardsSelectors.selectCardDetailsError) return of(null);
        if (selector === CardsSelectors.selectIsCardDetailsModalOpen) return of(false);
        if (selector === CardsSelectors.selectCurrentCardIndex) return of(0);
        if (selector === CardsSelectors.selectCurrentAccountCardIds) return of(['card-123']);
        if (selector === CardsSelectors.selectAllAccounts) return of([mockAccount]);
        if (typeof selector === 'function' || selector.projector) return of(mockAccount);
        return of(null);
      }),
      dispatch: vi.fn(),
    };

    const routerMock: MockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(mockCardId),
        },
      },
      paramMap: paramMapSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [CardDetails, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as unknown as MockStore;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture = TestBed.createComponent(CardDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch actions on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadCardAccounts({}));
    expect(store.dispatch).toHaveBeenCalledWith(
      loadCardDetails({ cardId: mockCardId }),
    );
  });

  it('should navigate back', () => {
    component['handleBack']();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should navigate to internal transfer', () => {
    component['handleTransferOwn']();
    expect(router.navigate).toHaveBeenCalledWith(['/bank/transfers/internal']);
  });

  it('should navigate to external transfer', () => {
    component['handleTransferExternal']();
    expect(router.navigate).toHaveBeenCalledWith(['/bank/transfers/external']);
  });

  it('should navigate to paybill', () => {
    component['handlePaybill']();
    expect(router.navigate).toHaveBeenCalledWith(['/bank/paybill']);
  });

  it('should navigate to transactions', () => {
    component['handleViewTransactions']();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should dispatch openCardDetailsModal', () => {
    component['handleOpenDetailsModal']();
    expect(store.dispatch).toHaveBeenCalledWith(
      openCardDetailsModal({ cardId: mockCardId }),
    );
  });

  it('should dispatch closeCardDetailsModal', () => {
    component['handleCloseDetailsModal']();
    expect(store.dispatch).toHaveBeenCalledWith(closeCardDetailsModal());
  });

  it('should dispatch navigateToNextCard and navigate', () => {
    const nextCardId = 'card-456';
    store.select = vi.fn((selector) => {
      if (selector === CardsSelectors.selectCurrentCardIndex) return of(1);
      if (selector === CardsSelectors.selectCurrentAccountCardIds) return of(['card-123', nextCardId]);
      if (selector === CardsSelectors.selectAllAccounts) return of([mockAccount]);
      return of(null);
    });

    component['handleNextCard']();

    expect(store.dispatch).toHaveBeenCalledWith(navigateToNextCard());
  });

  it('should dispatch navigateToPreviousCard and navigate', () => {
    const prevCardId = 'card-000';
    store.select = vi.fn((selector) => {
      if (selector === CardsSelectors.selectCurrentCardIndex) return of(0);
      if (selector === CardsSelectors.selectCurrentAccountCardIds) return of([prevCardId, 'card-123']);
      if (selector === CardsSelectors.selectAllAccounts) return of([mockAccount]);
      return of(null);
    });

    component['handlePreviousCard']();

    expect(store.dispatch).toHaveBeenCalledWith(navigateToPreviousCard());
  });
});