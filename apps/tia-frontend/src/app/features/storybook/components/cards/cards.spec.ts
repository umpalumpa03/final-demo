
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cards } from './cards';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';

describe('Cards', () => {
  let component: Cards;
  let fixture: ComponentFixture<Cards>;


  const mockTranslateService = {
  instant: vi.fn((key: string) => key),
  get: vi.fn((key: string) => ({ subscribe: vi.fn() })),
  stream: vi.fn((key: string) => ({ subscribe: vi.fn((fn: any) => fn(key)) })),
  getCurrentLang: vi.fn(() => 'en'),
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter(),
  use: vi.fn(),
  setDefaultLang: vi.fn(),
};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cards],
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Cards);
    component = fixture.componentInstance;
  });

  it('should initialize with correct metadata and data length', () => {
    expect(component.pageTitle).toBe('storybook.cards.pageTitle');
    expect(component.pageSubtitle).toBe('storybook.cards.pageSubtitle');
    expect(component.basicCards().length).toBe(3);
    expect(component.statisticsCards().length).toBe(4);
    expect(component.categoryCards().length).toBe(2);
  });

  it('should have unique ids in all cards', () => {
    const basicIds = component.basicCards().map((card) => card.id);
    const statsIds = component.statisticsCards().map((card) => card.id);
    const categoryIds = component.categoryCards().map((card) => card.id);

    expect(basicIds).toEqual(['basic-card-1', 'basic-card-2', 'basic-card-3']);
    expect(statsIds).toEqual([
      'stat-card-revenue',
      'stat-card-subscriptions',
      'stat-card-sales',
      'stat-card-active',
    ]);
    expect(categoryIds).toEqual(['category-card-1', 'category-card-2']);
  });

  it('should render all card components', () => {
    expect(component.basicCards().length).toBe(3);
    expect(component.statisticsCards().length).toBe(4);
    expect(component.categoryCards().length).toBe(2);
  });


  it('should update activeCategoryId when category card is clicked', () => {
    expect(component.activeCategoryId()).toBeNull();

    component.handleCategoryClick('category-card-1');
    expect(component.activeCategoryId()).toBe('category-card-1');

    component.handleCategoryClick('category-card-2');
    expect(component.activeCategoryId()).toBe('category-card-2');
  });

  it('should use TranslateService', () => {
    expect(mockTranslateService.instant).toHaveBeenCalled();
  });
});
