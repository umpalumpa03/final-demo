import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { CardList } from './card-list';
import * as CardsActions from '../../../../../../../../store/products/cards/cards.actions';
import { selectCardImagesLoading } from '../../../../../../../../store/products/cards/cards.selectors';

describe('CardList', () => {
  let component: CardList;
  let store: MockStore;
  let router: Router;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardList],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectCardImagesLoading, value: false }
          ]
        }),
        { provide: Router, useValue: { navigate: vi.fn() } }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    const fixture: ComponentFixture<CardList> = TestBed.createComponent(CardList);
    component = fixture.componentInstance;
    
    dispatchSpy = vi.spyOn(store, 'dispatch');
    navigateSpy = vi.spyOn(router, 'navigate');
  });

  it('should dispatch loadCardAccounts on init', () => {
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(CardsActions.loadCardAccounts({}));
  });

  it('should navigate to card details when single card', () => {
    component.handleCardClick({ accountId: '1', cardId: 'card1', index: 0, hasMultipleCards: false });
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/details', 'card1']);
  });

  it('should navigate to account when clicking active card with multiple cards', () => {
    component.activeCardIndex.set({ '1': 0 });
    component.handleCardClick({ accountId: '1', cardId: 'card1', index: 0, hasMultipleCards: true });
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/account', '1']);
  });

  it('should update activeCardIndex when clicking non-active card', () => {
    component.activeCardIndex.set({ '1': 0 });
    component.handleCardClick({ accountId: '1', cardId: 'card2', index: 1, hasMultipleCards: true });
    expect(component.activeCardIndex()).toEqual({ '1': 1 });
  });

  it('should dispatch openCreateCardModal', () => {
    component.handleOpenModal();
    expect(dispatchSpy).toHaveBeenCalledWith(CardsActions.openCreateCardModal());
  });

  it('should dispatch closeCreateCardModal', () => {
    component.handleCloseModal();
    expect(dispatchSpy).toHaveBeenCalledWith(CardsActions.closeCreateCardModal());
  });

  it('should navigate to account page', () => {
    component.handleViewAllCards({ accountId: '1' });
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/cards/account', '1']);
  });
});