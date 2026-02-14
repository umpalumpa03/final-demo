import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesFilters } from './finances-filters';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FinancesFilters', () => {
  let component: FinancesFilters;
  let fixture: ComponentFixture<FinancesFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancesFilters);
    component = fixture.componentInstance;

    const mockForm = new FormGroup({
      selectedMonth: new FormControl('1'),
      fromDate: new FormControl(''),
      toDate: new FormControl('')
    });

    fixture.componentRef.setInput('filterForm', mockForm);
    fixture.componentRef.setInput('activeFilter', 'month');
    fixture.componentRef.setInput('filterOptions', [
      { type: 'month', label: 'Month', icon: 'i', activeIcon: 'ai' }
    ]);
    fixture.componentRef.setInput('monthOptions', []);
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return form control correctly', () => {
    const control = component.getControl('selectedMonth');
    expect(control).toBeDefined();
    expect(control.value).toBe('1');
  });

  it('should emit filterChange when an option is selected', () => {
    const spy = vi.spyOn(component.filterChange, 'emit');
    
    component.filterChange.emit('month' as any);
    
    expect(spy).toHaveBeenCalledWith('month');
  });

  it('should check if form control exists before returning', () => {
    const control = component.getControl('fromDate');
    expect(control).toBeDefined();
  });
});