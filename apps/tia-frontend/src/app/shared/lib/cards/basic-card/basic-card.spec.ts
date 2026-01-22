import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cards } from 'apps/tia-frontend/src/app/features/admin/components/library/components/cards/cards';
import { BasicCard } from 'apps/tia-frontend/src/app/shared/lib/cards/basic-card/basic-card';
import { StatisticCard } from '../statistic-card/statistic-card';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/admin/components/library/shared/library-title/library-title';


describe('Cards', () => {
  let component: Cards;
  let fixture: ComponentFixture<Cards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cards, BasicCard, StatisticCard, LibraryTitle],
    }).compileComponents();

    fixture = TestBed.createComponent(Cards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have pageTitle property', () => {
    expect(component.pageTitle).toBe('Cards');
  });

  it('should have pageSubtitle property', () => {
    expect(component.pageSubtitle).toBe(
      'Card components with various layouts and content types',
    );
  });

  it('should initialize basicCards signal with two cards', () => {
    const cards = component.basicCards();
    expect(cards.length).toBe(2);
  });

  it('should initialize statisticsCards signal with four cards', () => {
    const cards = component.statisticsCards();
    expect(cards.length).toBe(4);
  });

  it('should have correct first basic card data', () => {
    const firstCard = component.basicCards()[0];
    expect(firstCard.title).toBe('Card Title');
    expect(firstCard.subtitle).toBe('Card description goes here');
    expect(firstCard.content).toBe(
      'This is the main content area of the card. You can put any content here.',
    );
  });

  it('should have correct first statistics card data', () => {
    const firstCard = component.statisticsCards()[0];
    expect(firstCard.label).toBe('Total Revenue');
    expect(firstCard.value).toBe('$45,231.89');
    expect(firstCard.change).toBe('+20.1% from last month');
    expect(firstCard.changeType).toBe('positive');
    expect(firstCard.icon).toBe('$');
  });

  it('should render LibraryTitle component', () => {
    const libraryTitle = fixture.nativeElement.querySelector('app-library-title');
    expect(libraryTitle).toBeTruthy();
  });

  it('should render two BasicCard components', () => {
    const basicCards = fixture.nativeElement.querySelectorAll('app-basic-card');
    expect(basicCards.length).toBe(2);
  });

  it('should render four StatisticCard components', () => {
    const statisticCards = fixture.nativeElement.querySelectorAll('app-statistic-card');
    expect(statisticCards.length).toBe(4);
  });

  it('should render Basic Cards section title', () => {
    const sections = fixture.nativeElement.querySelectorAll('.cards-section__title');
    expect(sections[0].textContent).toBe('Basic Cards');
  });

  it('should render Statistics Cards section title', () => {
    const sections = fixture.nativeElement.querySelectorAll('.cards-section__title');
    expect(sections[1].textContent).toBe('Statistics Cards');
  });
});