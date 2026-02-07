
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardGroupItem } from './card-group-item';
import { CardGroupView } from '../../models/card-list-view.model';

describe('CardGroupItem', () => {
  let component: CardGroupItem;
  let fixture: ComponentFixture<CardGroupItem>;

  const mockGroup: CardGroupView = {
    account: { id: '1', name: 'Account 1', iban: 'GB123', balance: 1000, currency: 'GBP', status: 'ACTIVE', cardIds: ['card1'], openedAt: null },
    cardImages: [{ cardId: 'card1', imageBase64: 'base64' }],
    cardCountLabel: '1 Card',
    activeIndex: 0,
    cards: [{ cardId: 'card1', imageBase64: 'base64', cardAlt: 'Card 1', isStacked: false, isActive: true, zIndex: 100, index: 0 }]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGroupItem]
    }).compileComponents();

    fixture = TestBed.createComponent(CardGroupItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('group', mockGroup);
    fixture.componentRef.setInput('isLoading', false);
  });

  it('should emit cardClicked with full data', () => {
    const emitSpy = vi.spyOn(component.cardClicked, 'emit');
    component.handleCardClick({ cardId: 'card1', index: 0 });
    expect(emitSpy).toHaveBeenCalledWith({ accountId: '1', cardId: 'card1', index: 0, hasMultipleCards: false });
  });

  it('should emit viewAllClicked with accountId', () => {
    const emitSpy = vi.spyOn(component.viewAllClicked, 'emit');
    component.handleViewAllClick();
    expect(emitSpy).toHaveBeenCalledWith({ accountId: '1' });
  });
});