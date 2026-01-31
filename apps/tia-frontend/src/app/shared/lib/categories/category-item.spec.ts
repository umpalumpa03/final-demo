import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryItem } from './category-item';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CategoryItemComponent', () => {
  let component: CategoryItem;
  let fixture: ComponentFixture<CategoryItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryItem);
    component = fixture.componentInstance;
  });

  it('should create and display correct data', () => {
    fixture.componentRef.setInput('label', 'Food');
    fixture.componentRef.setInput('amount', 1200);
    fixture.componentRef.setInput('percentage', 45);
    fixture.componentRef.setInput('color', '#3B82F6');
    fixture.componentRef.setInput('icon', '🍴');

    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('.category-item__label')).nativeElement;
    const amountEl = fixture.debugElement.query(By.css('.category-item__amount')).nativeElement;
    
    expect(labelEl.textContent).toContain('Food');
    expect(amountEl.textContent).toContain('$1,200');
  });

  it('should apply correct width and color to progress bar', () => {
    const testColor = '#EF4444';
    const testPercent = 75;

    fixture.componentRef.setInput('label', 'Housing');
    fixture.componentRef.setInput('amount', 2000);
    fixture.componentRef.setInput('percentage', testPercent);
    fixture.componentRef.setInput('color', testColor);
    fixture.componentRef.setInput('icon', '🏠');

    fixture.detectChanges();

    const progressBar = fixture.debugElement.query(By.css('.category-item__progress-bar')).nativeElement;

    expect(progressBar.style.width).toBe(`${testPercent}%`);
    expect(progressBar.style.backgroundColor).toBeDefined();
  });

  it('should format percentage correctly in the template', () => {
    fixture.componentRef.setInput('label', 'Test');
    fixture.componentRef.setInput('amount', 100);
    fixture.componentRef.setInput('percentage', 12.56);
    fixture.componentRef.setInput('color', '#000');
    fixture.componentRef.setInput('icon', '📦');

    fixture.detectChanges();

    const percentageEl = fixture.debugElement.query(By.css('.category-item__percentage')).nativeElement;
    expect(percentageEl.textContent).toContain('12.6%');
  });
});