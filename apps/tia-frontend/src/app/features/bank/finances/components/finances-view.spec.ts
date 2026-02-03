import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesView } from './finances-view';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

describe('FinancesView', () => {
  let component: FinancesView;
  let fixture: ComponentFixture<FinancesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesView, ReactiveFormsModule],
      providers: [provideCharts(withDefaultRegisterables())],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesView);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('financeTitle', 'Title');
    fixture.componentRef.setInput('financeSubTitle', 'Sub');
    fixture.componentRef.setInput('activeFilter', 'custom');
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('error', null);
    fixture.componentRef.setInput('filterOptions', []);
    fixture.componentRef.setInput('summaryCards', [{ label: 'T', value: '1' }]);
    fixture.componentRef.setInput('charts', []);
    fixture.componentRef.setInput('categories', []);
    fixture.componentRef.setInput('transactions', []);
    fixture.componentRef.setInput('filterForm', new FormGroup({
      fromDate: new FormControl('2026-01-01'),
      toDate: new FormControl('2026-01-31')
    }));

    fixture.detectChanges();
  });

  it('should cover template loops and validation', () => {
    const form = component.filterForm();
    const fromControl = component.getControl('fromDate');
    
    fromControl.setErrors({ required: true });
    fromControl.markAsTouched();
    expect(component.isFromDateInvalid).toBe(true);

    form.setErrors({ dateRangeInvalid: true });
    expect(component.isRangeInvalid).toBe(true);

    const spy = vi.spyOn(component.filterChange, 'emit');
    component.filterChange.emit('month' as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should cover empty states', () => {
    fixture.componentRef.setInput('summaryCards', []);
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();
    
    const noDataMsg = fixture.nativeElement.querySelector('.no-data');
    expect(noDataMsg).toBeTruthy();
  });
});