import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { FinancesContainer } from '../container/finances-container';
import { FinancesStore } from '../store/finances.store';

describe('Finances Container Integration Tests', () => {
  let component: FinancesContainer;
  let fixture: ComponentFixture<FinancesContainer>;
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

    fixture = TestBed.createComponent(FinancesContainer);
    component = fixture.componentInstance;
  });

  it('should initialize and load data on ngOnInit', () => {
    component.ngOnInit();
    expect(storeMock.loadAllData).toHaveBeenCalledWith(
      expect.objectContaining({ from: expect.any(String), force: false }),
    );
  });

  it('should toggle month filter and load data', () => {
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

  it('should call resetStore on ngOnDestroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(storeMock.resetStore).toHaveBeenCalled();
  });
});