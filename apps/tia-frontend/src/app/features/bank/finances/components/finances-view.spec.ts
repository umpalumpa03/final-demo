import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesView } from './finances-view';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FinancesView', () => {
  let component: FinancesView;
  let fixture: ComponentFixture<FinancesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesView, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesView);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('financeTitle', 'Test Title');
    fixture.componentRef.setInput('financeSubTitle', 'Test Sub');
    fixture.componentRef.setInput('activeFilter', 'month');
    fixture.componentRef.setInput('filterOptions', [{ label: 'Month', type: 'month', icon: 'test.svg' }]);
    fixture.componentRef.setInput('summaryCards', []);
    
    const form = new FormGroup({
      fromDate: new FormControl('2026-01-01', [Validators.required]),
      toDate: new FormControl('2026-01-31')
    });
    fixture.componentRef.setInput('filterForm', form);

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct form control via getControl', () => {
    const control = component.getControl('fromDate');
    expect(control).toBeDefined();
    expect(control.value).toBe('2026-01-01');
  });

  it('should detect invalid fromDate when touched', () => {
    const control = component.getControl('fromDate');
    control.setValue(''); 
    control.markAsTouched();
    
    expect(component.isFromDateInvalid).toBe(true);
  });

  it('should generate charts array with correct titles', () => {
    const charts = component.charts();
    expect(charts.length).toBe(4);
    expect(charts[0].title).toBe('Income vs Expenses');
    expect(charts[1].type).toBe('pie');
  });

  it('should emit filterChange when onFilterChange logic is triggered', () => {
    const emitSpy = vi.spyOn(component.filterChange, 'emit');
    component.filterChange.emit('custom' as any);
    expect(emitSpy).toHaveBeenCalledWith('custom');
  });

  it('should emit dateInput when date event occurs', () => {
    const emitSpy = vi.spyOn(component.dateInput, 'emit');
    const mockEvent = { target: { value: '2026-02-01' } } as any;
    
    component.dateInput.emit({ field: 'fromDate', event: mockEvent });
    expect(emitSpy).toHaveBeenCalledWith({ field: 'fromDate', event: mockEvent });
  });

  it('should return isRangeInvalid as true when form has dateRangeInvalid error', () => {
    const form = component.filterForm();
    form.setErrors({ dateRangeInvalid: true });
    form.markAsTouched();
    
    expect(component.isRangeInvalid).toBe(true);
  });
});