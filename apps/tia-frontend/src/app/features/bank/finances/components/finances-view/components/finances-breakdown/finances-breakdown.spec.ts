import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesBreakdown } from './finances-breakdown';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core'; 

describe('FinancesBreakdown', () => {
  let component: FinancesBreakdown;
  let fixture: ComponentFixture<FinancesBreakdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FinancesBreakdown, 
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesBreakdown);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should show no-data message when categories is empty and not loading', () => {
    fixture.componentRef.setInput('categories', []);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const noData = fixture.debugElement.query(By.css('.no-data'));
    expect(noData).toBeTruthy();
  });

  it('should render category items correctly', () => {
    const mockData = [
      { category: 'Food', amount: 100, percentage: 50, color: 'blue', icon: 'food' },
      { category: 'Bills', amount: 200, percentage: 50, color: 'red', icon: 'bill' }
    ];
    
    fixture.componentRef.setInput('categories', mockData);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('app-category-item'));
    expect(items.length).toBe(2);
  });
});