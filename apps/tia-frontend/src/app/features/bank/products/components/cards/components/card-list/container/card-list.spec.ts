
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { CardList } from './card-list';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadCardAccounts,
  openCreateCardModal,
  closeCreateCardModal,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardGroups,
  selectLoading,
  selectError,
  selectShowSuccessAlert,
  selectIsCreateModalOpen,
  selectCardImagesLoading,
} from '../../../../../../../../store/products/cards/cards.selectors';

describe('CardList', () => {
  let component: CardList;
  let fixture: ComponentFixture<CardList>;
  let store: MockStore;
  let router: Router;

  const mockCardGroups = [
    {
      account: {
        id: 'account-1',
        name: 'Main Account',
        iban: 'GE00XX0000000000000000',
        balance: 1000,
        currency: 'GEL',
        status: 'ACTIVE',
        cardIds: ['card-1', 'card-2'],
        openedAt: '2024-01-01',
      },
      cardImages: [
        {
          cardId: 'card-1',
          imageBase64: 'base64-image-1',
        },
        {
          cardId: 'card-2',
          imageBase64: 'base64-image-2',
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardList, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    store.overrideSelector(selectCardGroups, []);
    store.overrideSelector(selectLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectShowSuccessAlert, false);
    store.overrideSelector(selectIsCreateModalOpen, false);
    store.overrideSelector(selectCardImagesLoading, false);

    fixture = TestBed.createComponent(CardList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadCardAccounts on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadCardAccounts({}));
  });

  it('should transform card groups with single card', () => {
    const result = component.transformCardGroups([mockCardGroups[0]], {});

    expect(result[0].cardCountLabel).toBe('2');
    expect(result[0].cardCountKey).toBe('my-products.card.card-list.card-group-item.cardCountPlural');
    expect(result[0].activeIndex).toBe(0);
  });

  it('should transform card with active and stacked states', () => {
    const result = component.transformCardGroups(mockCardGroups, {});

    expect(result[0].cards[0].isActive).toBe(true);
    expect(result[0].cards[0].isStacked).toBe(false);
    expect(result[0].cards[1].isActive).toBe(false);
    expect(result[0].cards[1].isStacked).toBe(true);
  });

  it('should calculate stack position for card after active index', () => {
    const result = component.transformCardGroups(mockCardGroups, { 'account-1': 0 });

    expect(result[0].cards[1].stackPosition).toBe(1);
  });

  it('should calculate stack position for card before active index', () => {
    const result = component.transformCardGroups(mockCardGroups, { 'account-1': 1 });

    expect(result[0].cards[0].stackPosition).toBe(1);
  });

  it('should navigate to card details when single card', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.handleCardClick({
      accountId: 'account-1',
      cardId: 'card-1',
      index: 0,
      hasMultipleCards: false,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/details', 'card-1']);
  });

  it('should navigate to account when clicking active card', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.activeCardIndex.set({ 'account-1': 0 });

    component.handleCardClick({
      accountId: 'account-1',
      cardId: 'card-1',
      index: 0,
      hasMultipleCards: true,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/account', 'account-1']);
  });

  it('should update active index when clicking non-active card', () => {
    component.activeCardIndex.set({ 'account-1': 0 });

    component.handleCardClick({
      accountId: 'account-1',
      cardId: 'card-2',
      index: 1,
      hasMultipleCards: true,
    });

    expect(component.activeCardIndex()['account-1']).toBe(1);
  });

  it('should navigate to account page on view all', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.handleViewAllCards({ accountId: 'account-1' });
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/account', 'account-1']);
  });

  it('should dispatch openCreateCardModal', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleOpenModal();
    expect(dispatchSpy).toHaveBeenCalledWith(openCreateCardModal());
  });

  it('should dispatch closeCreateCardModal', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleCloseModal();
    expect(dispatchSpy).toHaveBeenCalledWith(closeCreateCardModal());
  });
});