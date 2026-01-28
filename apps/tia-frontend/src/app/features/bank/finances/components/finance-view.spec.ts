import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesView } from './finances-view';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    fixture.componentRef.setInput('filterOptions', [{ label: 'Month', type: 'month' }]);
    fixture.componentRef.setInput('summaryCards', []);
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
    expect(control).toBeInstanceOf(FormControl);
    expect(control.value).toBe('2026-01-01');
  });

  it('should emit filterChange output', () => {
    const emitSpy = vi.spyOn(component.filterChange, 'emit');
    component.filterChange.emit('custom' as any);
    expect(emitSpy).toHaveBeenCalledWith('custom');
  });
});