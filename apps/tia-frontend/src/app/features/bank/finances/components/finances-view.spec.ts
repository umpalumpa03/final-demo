import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesView } from './finances-view';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FinancesView', () => {
  let component: FinancesView;
  let fixture: ComponentFixture<FinancesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesView, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesView);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('financeTitle', 'Dashboard');
    fixture.componentRef.setInput('financeSubTitle', 'Overview');
    fixture.componentRef.setInput('activeFilter', 'month');
    fixture.componentRef.setInput('filterOptions', []);
    fixture.componentRef.setInput('filterForm', new FormGroup({
       selectedMonth: new FormControl(''),
       fromDate: new FormControl(''),
       toDate: new FormControl('')
    }));
    fixture.componentRef.setInput('charts', []);
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render all child sections', () => {
    const selectors = [
      'app-library-title',
      'app-finances-filters',
      'app-finances-summary',
      'app-finances-charts',
      'app-finances-breakdown',
      'app-finances-transactions'
    ];

    selectors.forEach(selector => {
      const element = fixture.nativeElement.querySelector(selector);
      expect(element).not.toBeNull();
    });
  });


  it('should emit filterChange when app-finances-filters triggers it', () => {
    const spy = vi.spyOn(component.filterChange, 'emit');
    const filtersEl = fixture.debugElement.query(By.css('app-finances-filters'));

    filtersEl.triggerEventHandler('filterChange', 'custom');

    expect(spy).toHaveBeenCalledWith('custom');
  });

  it('should emit filterChange when app-finances-summary triggers retry', () => {
    const spy = vi.spyOn(component.filterChange, 'emit');
    const summaryEl = fixture.debugElement.query(By.css('app-finances-summary'));

    summaryEl.triggerEventHandler('retry', 'month');

    expect(spy).toHaveBeenCalledWith('month');
  });
});