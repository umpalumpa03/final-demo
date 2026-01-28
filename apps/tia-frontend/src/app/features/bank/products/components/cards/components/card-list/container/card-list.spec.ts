
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { CardList } from './card-list';
import { loadCardAccounts } from '../../../../../../../../store/products/cards/cards.actions';
import { selectCardGroups, selectLoading, selectError } from '../../../../../../../../store/products/cards/cards.selectors';
import { CardGroup } from '../../../models/card-group.model';

describe('CardList', () => {
  let component: CardList;
  let fixture: ComponentFixture<CardList>;
  let mockStore: { select: ReturnType<typeof vi.fn>; dispatch: ReturnType<typeof vi.fn> };
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  const singleCardGroup: CardGroup = {
    account: {
      id: 'acc1',
      iban: 'GE29TIA7890123456789012',
      name: 'Main GEL Account',
      balance: 4500000,
      currency: 'GEL',
      status: 'active',
      cardIds: ['card1'],
      openedAt: '2026-01-18T01:10:50.948Z',
    },
    cardImages: [{ cardId: 'card1', imageBase64: 'data:image/svg+xml;base64,test1' }],
  };

  const multiCardGroup: CardGroup = {
    account: {
      id: 'acc2',
      iban: 'GE29TIA7890123456789013',
      name: 'EUR Current',
      balance: 1500000,
      currency: 'EUR',
      status: 'active',
      cardIds: ['card2', 'card3'],
      openedAt: '2026-01-18T01:10:50.948Z',
    },
    cardImages: [
      { cardId: 'card2', imageBase64: 'data:image/svg+xml;base64,test2' },
      { cardId: 'card3', imageBase64: 'data:image/svg+xml;base64,test3' },
    ],
  };

  const emptyCardGroup: CardGroup = {
    account: {
      id: 'acc3',
      iban: 'GE00TIAC9D8CF5ECADBD29',
      name: 'Current Account',
      balance: 0,
      currency: 'GEL',
      status: 'active',
      cardIds: [],
      openedAt: null,
    },
    cardImages: [],
  };

  beforeEach(async () => {
    mockStore = {
      select: vi.fn((selector) => {
        if (selector === selectCardGroups) {
          return of([singleCardGroup, multiCardGroup, emptyCardGroup]);
        }
        if (selector === selectLoading) {
          return of(false);
        }
        if (selector === selectError) {
          return of(null);
        }
        return of(null);
      }),
      dispatch: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CardList],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardList);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should dispatch loadCardAccounts on init', () => {
      fixture.detectChanges();
      expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardAccounts());
    });
  });

  describe('Card Navigation', () => {
    it('should navigate to card details when single card is clicked', () => {
      component.handleCardClick(singleCardGroup, 'card1', 0);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/products/cards/details', 'card1']);
    });

    it('should navigate to account page when active card in multi-card group is clicked', () => {
      component.handleCardClick(multiCardGroup, 'card2', 0);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/products/cards/account', 'acc2']);
    });
  });

  describe('Card Switching', () => {
    it('should update active card index when non-active card is clicked', () => {
      component.handleCardClick(multiCardGroup, 'card3', 1);
      expect(component.getCardIndex('acc2')).toBe(1);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should navigate after making card active and clicking again', () => {
      component.handleCardClick(multiCardGroup, 'card3', 1);
      expect(component.getCardIndex('acc2')).toBe(1);
      
      component.handleCardClick(multiCardGroup, 'card3', 1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/products/cards/account', 'acc2']);
    });
  });

  describe('Card Index Management', () => {
    it('should return 0 as default card index for non-existent account', () => {
      expect(component.getCardIndex('nonexistent')).toBe(0);
    });

    it('should maintain separate active indices for different accounts', () => {
      component.handleCardClick(multiCardGroup, 'card3', 1);
      expect(component.getCardIndex('acc2')).toBe(1);
      expect(component.getCardIndex('acc1')).toBe(0);
    });
  });
});
