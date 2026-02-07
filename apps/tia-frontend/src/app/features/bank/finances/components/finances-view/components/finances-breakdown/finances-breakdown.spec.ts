import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesBreakdown } from './finances-breakdown';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FinancesBreakdown', () => {
  let component: FinancesBreakdown;
  let fixture: ComponentFixture<FinancesBreakdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesBreakdown]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesBreakdown);
    component = fixture.componentInstance;
  });

  it('should create and show no-data message when empty', () => {
    fixture.componentRef.setInput('categories', []);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const noData = fixture.debugElement.query(By.css('.no-data'));
    expect(noData).toBeTruthy();
    expect(noData.nativeElement.textContent).toContain('No categories found');
  });

  it('should render correct number of category items', () => {
    const mockData = [
      { category: 'Food', amount: 100, percentage: 50, color: 'blue', icon: '🍴' },
      { category: 'Bills', amount: 200, percentage: 50, color: 'red', icon: '📦' }
    ];
    
    fixture.componentRef.setInput('categories', mockData);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('app-category-item'));
    expect(items.length).toBe(2);
  });

  it('should hide no-data message while loading', () => {
    fixture.componentRef.setInput('categories', []);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const noData = fixture.debugElement.query(By.css('.no-data'));
    expect(noData).toBeNull();
  });
});