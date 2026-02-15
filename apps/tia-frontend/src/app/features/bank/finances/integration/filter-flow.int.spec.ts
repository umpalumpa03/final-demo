import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { FinancesContainer } from '../container/finances-container';
import { FinancesStore } from '../store/finances.store';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { dateRangeValidator } from '../validators/date-range.validator';

describe('Finances Integration - Filter Flow', () => {
  let component: FinancesContainer;
  let storeMock: any;

  beforeEach(async () => {
    storeMock = {
      loadAllData: vi.fn(),
      resetStore: vi.fn(), 
      loading: signal(false),
      isRefreshing: signal(false),
      error: signal(null),
      summaryCards: signal([]),
      charts: signal([]),
      categoriesWithIcons: signal([]),
      transactionsWithIcons: signal([]),
      incomeVsExpensesFooter: signal(null),
      topCategoriesFooter: signal([]),
      savingsFooter: signal(null),
      dailySpendingFooter: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [FinancesContainer, TranslateModule.forRoot()],
      providers: [{ provide: FinancesStore, useValue: storeMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinancesContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should activate month filter and load data', () => {
    vi.clearAllMocks();

    component.onFilterChange('month');
    expect(component.activeFilter()).toBe('month');

    component.filterForm.patchValue({ selectedMonth: '2026-02-01' });
    component['fetchData']();

    expect(storeMock.loadAllData).toHaveBeenCalledWith({
      from: '2026-02-01',
      force: false,
    });
  });

  it('should activate custom filter and load data with date range', () => {
    vi.clearAllMocks();

    component.onFilterChange('custom');
    expect(component.activeFilter()).toBe('custom');

    component.filterForm.patchValue({
      fromDate: '2026-01-01',
      toDate: '2026-01-31',
    });
    component['fetchData']();

    expect(storeMock.loadAllData).toHaveBeenCalledWith({
      from: '2026-01-01',
      to: '2026-01-31',
      force: false,
    });
  });

  it('should validate date range', () => {
    const invalidForm = new FormGroup(
      {
        fromDate: new FormControl('2026-02-01'),
        toDate: new FormControl('2026-01-01'),
      },
      { validators: dateRangeValidator('fromDate', 'toDate') },
    );

    expect(invalidForm.valid).toBe(false);
    expect(invalidForm.errors).toHaveProperty('dateRangeInvalid');
  });

  it('should clear form when switching filters', () => {
    component.onFilterChange('month');
    component.filterForm.patchValue({ selectedMonth: '2026-01-01' });

    component.onFilterChange('custom');

    expect(component.filterForm.get('selectedMonth')?.value).toBe('');
    expect(component.filterForm.get('fromDate')?.value).toBe('');
    expect(component.filterForm.get('toDate')?.value).toBe('');
  });

  it('should force refresh when onUpdateData is called', () => {
    component.onUpdateData();

    expect(storeMock.loadAllData).toHaveBeenCalledWith(
      expect.objectContaining({
        force: true,
      }),
    );
  });

  it('should call resetStore on component destruction', () => {
    const fixture = TestBed.createComponent(FinancesContainer);
    fixture.detectChanges();
    fixture.destroy();
    
    expect(storeMock.resetStore).toHaveBeenCalled();
  });
});