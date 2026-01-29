import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesView } from './finances-view';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

describe('FinancesView', () => {
  let component: FinancesView;
  let fixture: ComponentFixture<FinancesView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesView, ReactiveFormsModule],
      providers: [
        provideCharts(withDefaultRegisterables())
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesView);
    component = fixture.componentInstance;

    // სავალდებულო ინფუთები
    fixture.componentRef.setInput('financeTitle', 'Test Title');
    fixture.componentRef.setInput('financeSubTitle', 'Test Sub');
    fixture.componentRef.setInput('activeFilter', 'month');
    fixture.componentRef.setInput('filterOptions', []);
    fixture.componentRef.setInput('summaryCards', []);
    fixture.componentRef.setInput('charts', []);
    fixture.componentRef.setInput('filterForm', new FormGroup({
      fromDate: new FormControl('2026-01-01'),
      toDate: new FormControl('2026-01-31')
    }));

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
    control.setValidators([() => ({ required: true })]);
    control.setValue(''); 
    control.markAsTouched();
    fixture.detectChanges();
    expect(component.isFromDateInvalid).toBe(true);
  });

  it('should emit filterChange when filterChange output is triggered', () => {
    const emitSpy = vi.spyOn(component.filterChange, 'emit');
    component.filterChange.emit('custom' as any);
    expect(emitSpy).toHaveBeenCalledWith('custom');
  });

  it('should return isRangeInvalid as true when form has error', () => {
    const form = component.filterForm();
    form.setErrors({ dateRangeInvalid: true });
    form.markAsTouched();
    expect(component.isRangeInvalid).toBe(true);
  });
});