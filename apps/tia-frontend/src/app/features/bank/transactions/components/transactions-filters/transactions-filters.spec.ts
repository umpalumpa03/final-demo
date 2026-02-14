import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsFilters } from './transactions-filters';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TransactionsViewModelService } from '../../services/transactions-view-model.service';
import { TransactionsActionsService } from '../../services/transactions-actions.service';

describe('TransactionsFilters', () => {
  let component: TransactionsFilters;
  let fixture: ComponentFixture<TransactionsFilters>;

  const mockViewModel = {
    accountOptions: signal([]),
    currencyOptions: signal([]),
  };

  const mockActionsService = {
    isFiltersOpen: signal(false),
    toggleFilters: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionsFilters,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: TransactionsViewModelService, useValue: mockViewModel },
        { provide: TransactionsActionsService, useValue: mockActionsService },
        TranslateService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsFilters);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('categoryOptions', []);
    fixture.componentRef.setInput('accountOptions', []);
    fixture.componentRef.setInput('currencyOptions', []);

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format form values and emit after debounce', () => {
    vi.useFakeTimers();
    const emitSpy = vi.spyOn(component.filterChange, 'emit');


    component.filterForm.patchValue({
      searchCriteria: 'Test Search',
      accountIban: 'GE123',
    });

    vi.advanceTimersByTime(450);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should clear all filters on resetFilters call', () => {
    component.filterForm.patchValue({ searchCriteria: 'Test' });
    component.resetFilters();
    expect(component.filterForm.getRawValue().searchCriteria).toBeNull();
  });

  it('should remove specific filter on removeFilter call', () => {
    component.filterForm.patchValue({
      searchCriteria: 'Test',
      currency: 'USD' as any,
    });

    component.removeFilter('searchCriteria');

    expect(component.filterForm.getRawValue().searchCriteria).toBeNull();
    expect(component.filterForm.getRawValue().currency).toBe('USD');
  });
});