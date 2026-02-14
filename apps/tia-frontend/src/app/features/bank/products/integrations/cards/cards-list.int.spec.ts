import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

import { AlertService } from '@tia/core/services/alert/alert.service';
import { CardList } from '../../components/cards/components/card-list/container/card-list';
import { selectCardGroups, selectCardImagesLoading } from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import { selectError, selectLoading } from '../../../paybill/store/paybill.selectors';
import { selectIsCreateModalOpen } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { closeCreateCardModal, loadCardAccounts, openCreateCardModal } from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';

describe('CardList Integration', () => {
  let component: CardList;
  let fixture: ComponentFixture<CardList>;
  let store: MockStore;
  let router: Router;

  const mockCardGroups = [
    {
      account: {
        id: 'acc-1',
        name: 'Main Account',
        iban: 'GE00XX0000000000000000',
        balance: 1000,
        currency: 'GEL',
        status: 'ACTIVE',
        cardIds: ['card-1', 'card-2'],
        openedAt: '2024-01-01',
      },
      cardImages: [
        { cardId: 'card-1', imageBase64: 'base64-1' },
        { cardId: 'card-2', imageBase64: 'base64-2' },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardList, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            cards: {
              accounts: mockCardGroups.map(g => g.account),
              cardImages: { 'card-1': 'base64-1', 'card-2': 'base64-2' },
              loading: false,
              error: null,
              isCreateModalOpen: false,
              cardImagesLoading: false,
            },
          },
        }),
        { provide: Router, useValue: { navigate: vi.fn() } },
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

    store.overrideSelector(selectCardGroups, mockCardGroups);
    store.overrideSelector(selectLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectIsCreateModalOpen, false);
    store.overrideSelector(selectCardImagesLoading, false);

    fixture = TestBed.createComponent(CardList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load card accounts on init and display cards', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    component.ngOnInit();
    
    expect(dispatchSpy).toHaveBeenCalledWith(loadCardAccounts({ forceRefresh: true }));
    
    const transformed = component.transformCardGroups(mockCardGroups, {});
    expect(transformed[0].cards.length).toBe(2);
    expect(transformed[0].cards[0].isActive).toBe(true);
  });

  it('should navigate to card details when single card clicked', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    
    component.handleCardClick({
      accountId: 'acc-1',
      cardId: 'card-1',
      index: 0,
      hasMultipleCards: false,
    });
    
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/details', 'card-1']);
  });

  it('should update active card when multiple cards and non-active clicked', () => {
    component.activeCardIndex.set({ 'acc-1': 0 });
    
    component.handleCardClick({
      accountId: 'acc-1',
      cardId: 'card-2',
      index: 1,
      hasMultipleCards: true,
    });
    
    expect(component.activeCardIndex()['acc-1']).toBe(1);
  });

  it('should navigate to account page when active card clicked with multiple cards', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.activeCardIndex.set({ 'acc-1': 0 });
    
    component.handleCardClick({
      accountId: 'acc-1',
      cardId: 'card-1',
      index: 0,
      hasMultipleCards: true,
    });
    
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/account', 'acc-1']);
  });

  it('should open create card modal', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    component.handleOpenModal();
    
    expect(dispatchSpy).toHaveBeenCalledWith(openCreateCardModal());
  });

  it('should close create card modal', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    component.handleCloseModal();
    
    expect(dispatchSpy).toHaveBeenCalledWith(closeCreateCardModal());
  });

  it('should transform card groups with stack positions', () => {
    const result = component.transformCardGroups(mockCardGroups, { 'acc-1': 1 });
    
    expect(result[0].activeIndex).toBe(1);
    expect(result[0].cards[0].isActive).toBe(false);
    expect(result[0].cards[1].isActive).toBe(true);
    expect(result[0].cards[0].stackPosition).toBe(1);
  });
});