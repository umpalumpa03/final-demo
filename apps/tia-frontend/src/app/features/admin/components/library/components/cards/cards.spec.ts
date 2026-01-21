import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cards } from './cards';
import { BasicCard } from '../../../../../../shared/lib/cards/basic-card/basic-card';
import { LibraryTitle } from '../../shared/library-title/library-title';

describe('Cards', () => {
  let component: Cards;
  let fixture: ComponentFixture<Cards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cards, BasicCard, LibraryTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(Cards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pageTitle signal', () => {
    expect(component.pageTitle()).toBe('Cards');
  });

  it('should initialize pageSubtitle signal', () => {
    expect(component.pageSubtitle()).toBe('Card components with various layouts and content types');
  });

  it('should initialize basicCards signal with two cards', () => {
    const cards = component.basicCards();
    expect(cards.length).toBe(2);
  });

  it('should have correct first card data', () => {
    const firstCard = component.basicCards()[0];
    expect(firstCard.title).toBe('Card Title');
    expect(firstCard.subtitle).toBe('Card description goes here');
    expect(firstCard.content).toBe('This is the main content area of the card. You can put any content here.');
  });

  it('should have correct second card data', () => {
    const secondCard = component.basicCards()[1];
    expect(secondCard.title).toBe('Hover Effect');
    expect(secondCard.subtitle).toBe('Hover over this card');
    expect(secondCard.content).toBe('This card has hover effects applied.');
  });

  it('should render LibraryTitle component', () => {
    const libraryTitle = fixture.nativeElement.querySelector('app-library-title');
    expect(libraryTitle).toBeTruthy();
  });

  it('should render two BasicCard components', () => {
    const basicCards = fixture.nativeElement.querySelectorAll('app-basic-card');
    expect(basicCards.length).toBe(2);
  });
});