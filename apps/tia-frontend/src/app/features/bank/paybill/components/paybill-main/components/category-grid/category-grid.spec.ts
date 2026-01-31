import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryGrid } from './category-grid';
import { describe, it, expect, beforeEach } from 'vitest';
import { PaybillCategory } from '../../shared/models/paybill.model';

describe('CategoryGrid', () => {
  let component: CategoryGrid;
  let fixture: ComponentFixture<CategoryGrid>;

  const mockCategories: PaybillCategory[] = [
    {
      id: 'phone',
      name: 'Phone',
      icon: 'phone-icon.svg',
      providers: [],
      subtitle: 'Mobile & Data',
      iconBgColor: '#00C950',
      count: 0,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryGrid);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('categories', mockCategories);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of category cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('app-category-card');
    expect(cards.length).toBe(1);
  });

  it('should emit selected category ID when onCategoryClick is called', () => {
    let emittedId: string | undefined;

    component.selected.subscribe((id) => (emittedId = id));

    component.onCategoryClick('phone');

    expect(emittedId).toBe('phone');
  });
});
