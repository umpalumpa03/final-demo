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
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .overrideComponent(FinancesView, {
      set: {
        imports: [ReactiveFormsModule],
        providers: []
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancesView);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('financeTitle', 'Dashboard');
    fixture.componentRef.setInput('financeSubTitle', 'Overview');
    fixture.componentRef.setInput('activeFilter', 'month');
    fixture.componentRef.setInput('filterOptions', []);
    fixture.componentRef.setInput('filterForm', new FormGroup({
       selectedMonth: new FormControl('1'),
       fromDate: new FormControl(''),
       toDate: new FormControl('')
    }));
    fixture.componentRef.setInput('charts', []);
    fixture.componentRef.setInput('loading', false);
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the loader instead of content when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const loader = fixture.debugElement.query(By.css('app-route-loader'));
    expect(loader).toBeTruthy();
    
    const summary = fixture.nativeElement.querySelector('app-finances-summary');
    expect(summary).toBeNull();
  });

  it('should render all child sections when loading is false', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

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

  it('should emit update event when filter triggers it', () => {
    const spy = vi.spyOn(component.update, 'emit');
    const filtersEl = fixture.debugElement.query(By.css('app-finances-filters'));

    filtersEl.triggerEventHandler('update', null);

    expect(spy).toHaveBeenCalled();
  });

  it('should emit filterChange when app-finances-summary triggers retry', () => {
    const spy = vi.spyOn(component.filterChange, 'emit');
    const summaryEl = fixture.debugElement.query(By.css('app-finances-summary'));

    summaryEl.triggerEventHandler('retry', 'month');

    expect(spy).toHaveBeenCalledWith('month');
  });
});