import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryGrid } from './category-grid';
import { describe, it, expect, beforeEach } from 'vitest';
import { PaybillCategory } from '../../../../shared/models/paybill.model';

describe('CategoryGrid', () => {
  let component: CategoryGrid;
  let fixture: ComponentFixture<CategoryGrid>;

  const mockCategories: PaybillCategory[] = [
    {
      id: 'phone',
      name: 'Phone',
      icon: 'phone-icon.svg',
      providers: [],
      iconBgColor: '#00C950',
      description: 'hello',
      servicesQuantity: 5,
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

  it('should emit selected category ID when onCategoryClick is called', () => {
    let emittedId: string | undefined;

    component.selected.subscribe((id) => (emittedId = id));

    component.onCategoryClick('phone');

    expect(emittedId).toBe('phone');
  });
});
