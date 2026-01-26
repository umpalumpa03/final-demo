import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cards } from './cards';
import { BasicCard } from 'apps/tia-frontend/src/app/shared/lib/cards/basic-card/basic-card';
import { StatisticCard } from 'apps/tia-frontend/src/app/shared/lib/cards/statistic-card/statistic-card';
import { CategoryCard } from 'apps/tia-frontend/src/app/shared/lib/cards/category-card/category-card';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

describe('Cards', () => {
  let component: Cards;
  let fixture: ComponentFixture<Cards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cards, BasicCard, StatisticCard, CategoryCard, LibraryTitle, ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Cards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with correct metadata and data length', () => {
    expect(component.pageTitle).toBe('Cards');
    expect(component.pageSubtitle).toBe('Card components with various layouts and content types');
    expect(component.basicCards().length).toBe(3);
    expect(component.statisticsCards().length).toBe(4);
    expect(component.categoryCards().length).toBe(2);
  });

  it('should have unique ids in all cards', () => {
    const basicIds = component.basicCards().map(card => card.id);
    const statsIds = component.statisticsCards().map(card => card.id);
    const categoryIds = component.categoryCards().map(card => card.id);

    expect(basicIds).toEqual(['basic-card-1', 'basic-card-2', 'basic-card-3']);
    expect(statsIds).toEqual(['stat-card-revenue', 'stat-card-subscriptions', 'stat-card-sales', 'stat-card-active']);
    expect(categoryIds).toEqual(['category-card-1', 'category-card-2']);
  });

  it('should render all card components', () => {
    const basicCards = fixture.nativeElement.querySelectorAll('app-basic-card');
    const statisticCards = fixture.nativeElement.querySelectorAll('app-statistic-card');
    const categoryCards = fixture.nativeElement.querySelectorAll('app-category-card');

    expect(basicCards.length).toBe(3);
    expect(statisticCards.length).toBe(4);
    expect(categoryCards.length).toBe(2);
  });

  it('should render section titles and footer buttons', () => {
    const sections = fixture.nativeElement.querySelectorAll('.cards-section__title');
    
    expect(sections[0].textContent).toBe('Basic Cards');
    expect(sections[1].textContent).toBe('Statistics Cards');
    expect(sections[2].textContent).toBe('Category Cards');
    
    const footers = fixture.nativeElement.querySelectorAll('.card-footer');
    expect(footers.length).toBe(1);
    
    const buttons = footers[0].querySelectorAll('app-button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('Cancel');
    expect(buttons[1].textContent.trim()).toBe('Submit');
  });

  it('should update activeCategoryId when category card is clicked', () => {
    expect(component.activeCategoryId()).toBeNull();
    
    component.handleCategoryClick('category-card-1');
    expect(component.activeCategoryId()).toBe('category-card-1');
    
    component.handleCategoryClick('category-card-2');
    expect(component.activeCategoryId()).toBe('category-card-2');
  });
});