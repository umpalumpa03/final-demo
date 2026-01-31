import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { CardList } from './card-list';
import {
  loadCardAccounts,
  hideSuccessAlert,
  openCreateCardModal,
  closeCreateCardModal,
} from '../../../../../../../../store/products/cards/cards.actions';
import * as CardsSelectors from '../../../../../../../../store/products/cards/cards.selectors';
import { CardGroup } from '@tia/shared/models/cards/card-group.model';

interface MockStore {
  select: Mock;
  dispatch: Mock;
}

interface MockRouter {
  navigate: Mock;
}

describe('CardList', () => {
  let component: CardList;
  let fixture: ComponentFixture<CardList>;
  let store: MockStore;
  let router: MockRouter;

  const mockCardGroups: CardGroup[] = [
    {
      account: {
        id: 'acc-123',
        iban: 'GE00TB0000000000000000',
        name: 'My Account',
        balance: 1000,
        currency: 'GEL',
        status: 'ACTIVE',
        cardIds: ['card-123', 'card-456'],
        openedAt: '2024-01-01',
      },
      cardImages: [
        {
          cardId: 'card-123',
          imageBase64: 'data:image/png;base64,abc123',
        },
        {
          cardId: 'card-456',
          imageBase64: 'data:image/png;base64,def456',
        },
      ],
    },
  ];

  beforeEach(async () => {
    const storeMock: MockStore = {
      select: vi.fn((selector) => {
        if (selector === CardsSelectors.selectCardGroups) {
          return of(mockCardGroups);
        }
        if (selector === CardsSelectors.selectLoading) {
          return of(false);
        }
        if (selector === CardsSelectors.selectError) {
          return of(null);
        }
        if (selector === CardsSelectors.selectShowSuccessAlert) {
          return of(false);
        }
        if (selector === CardsSelectors.selectIsCreateModalOpen) {
          return of(false);
        }
        return of(null);
      }),
      dispatch: vi.fn(),
    };

    const routerMock: MockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CardList],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as unknown as MockStore;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture = TestBed.createComponent(CardList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadCardAccounts on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadCardAccounts());
  });

  it('should open modal', () => {
    component['openModal']();
    expect(store.dispatch).toHaveBeenCalledWith(openCreateCardModal());
  });

  it('should close modal', () => {
    component['handleCloseModal']();
    expect(store.dispatch).toHaveBeenCalledWith(closeCreateCardModal());
  });

  describe('Card click handling', () => {
    it('should navigate to card details when single card', () => {
      component['handleCardClick']('acc-123', 'card-123', 0, false);
      expect(router.navigate).toHaveBeenCalledWith(['/bank/products/cards/details', 'card-123']);
    });

    it('should navigate to account when clicking active card with multiple cards', () => {
      component['activeCardIndex'].set({ 'acc-123': 0 });
      component['handleCardClick']('acc-123', 'card-123', 0, true);
      expect(router.navigate).toHaveBeenCalledWith(['/bank/products/cards/account', 'acc-123']);
    });

    it('should update active index when clicking non-active card', () => {
      component['activeCardIndex'].set({ 'acc-123': 0 });
      component['handleCardClick']('acc-123', 'card-456', 1, true);
      expect(component['activeCardIndex']()).toEqual({ 'acc-123': 1 });
    });
  });

  it('should navigate to view all cards', () => {
    component['handleViewAllCards']('acc-123');
    expect(router.navigate).toHaveBeenCalledWith(['/bank/products/cards/account', 'acc-123']);
  });

  describe('Observables', () => {
    it('should emit cardGroups', () => {
      let result: CardGroup[] | undefined;
      component['cardGroups$'].subscribe((val: CardGroup[]) => {
        result = val;
      });
      expect(result).toEqual(mockCardGroups);
    });

    it('should emit loading false', () => {
      let result: boolean | undefined;
      component['loading$'].subscribe((val: boolean) => {
        result = val;
      });
      expect(result).toBe(false);
    });

    it('should emit null error', () => {
      let result: string | null | undefined;
      component['error$'].subscribe((val: string | null) => {
        result = val;
      });
      expect(result).toBeNull();
    });

    it('should emit showSuccessAlert false', () => {
      let result: boolean | undefined;
      component['showSuccessAlert$'].subscribe((val: boolean) => {
        result = val;
      });
      expect(result).toBe(false);
    });

    it('should emit isModalOpen false', () => {
      let result: boolean | undefined;
      component['isModalOpen$'].subscribe((val: boolean) => {
        result = val;
      });
      expect(result).toBe(false);
    });
  });
});