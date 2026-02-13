
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardStack } from './card-stack';
import { CardImageView } from '../../models/card-list-view.model';

describe('CardStack', () => {
  let component: CardStack;
  let fixture: ComponentFixture<CardStack>;

  const mockCards: CardImageView[] = [
    { cardId: 'card1', imageBase64: 'base64-1', cardAlt: 'Card 1', isStacked: false, isActive: true, zIndex: 100, index: 0,stackPosition: 0   }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardStack]
    }).compileComponents();

    fixture = TestBed.createComponent(CardStack);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cards', mockCards);
    fixture.componentRef.setInput('hasMultipleCards', false);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
  });

  it('should emit cardClicked on card click', () => {
    const emitSpy = vi.spyOn(component.cardClicked, 'emit');
    component.handleCardClick('card1', 0);
    expect(emitSpy).toHaveBeenCalledWith({ cardId: 'card1', index: 0 });
  });

  it('should show skeleton when loading', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-skeleton')).toBeTruthy();
  });


});
