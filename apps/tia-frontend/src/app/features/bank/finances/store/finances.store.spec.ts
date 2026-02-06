import { TestBed } from '@angular/core/testing';
import { FinancesStore } from './finances.store';
import { FinancesService } from '../services/finances.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { patchState } from '@ngrx/signals';

describe('FinancesStore', () => {
  let store: any;
  let service: any;

  beforeEach(() => {
    service = {
      getSummary: vi.fn(),
      getCategories: vi.fn(),
      getRecentTransactions: vi.fn(),
      getIncomeVsExpenses: vi.fn(),
      getSavingsTrend: vi.fn(),
      getDailySpending: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        FinancesStore,
        { provide: FinancesService, useValue: service }
      ]
    });
    store = TestBed.inject(FinancesStore);
  });

  it('should handle successful loadAllData and summary mapping', () => {
    const mockSummary = { 
      totalIncome: 5000, 
      totalExpenses: 3000, 
      netProfit: 2000,
      incomeChange: 10,
      expenseChange: -5,
      netProfitChange: 15,
      savingsRate: 20,
      savingsRateChange: 2
    };

    service.getSummary.mockReturnValue(of(mockSummary));
    service.getCategories.mockReturnValue(of([{ category: 'Food', amount: 500, color: '#6B7280' }]));
    service.getDailySpending.mockReturnValue(of([{ day: 1, amount: 50 }]));
    service.getIncomeVsExpenses.mockReturnValue(of([{ month: 'Jan', income: 1000, expenses: 800 }]));
    service.getSavingsTrend.mockReturnValue(of([{ month: 'Jan', savings: 200 }]));
    service.getRecentTransactions.mockReturnValue(of([]));

    store.loadAllData({ from: '2026-01-01' });

    expect(store.loading()).toBe(false);
    expect(store.summary()).toEqual(mockSummary);
    expect(store.summaryCards().length).toBeGreaterThan(0);
    expect(store.incomeVsExpensesFooter()?.isNetPositive).toBe(true);
  });

  

  it('should compute all chart configurations correctly', () => {
    patchState(store, {
      incomeVsExpenses: [{ month: 'Jan', income: 1000, expenses: 800 }],
      categories: [{ category: 'Food', amount: 500, color: 'red' }],
      savingsTrend: [{ month: 'Jan', savings: 200 }],
      dailySpending: [{ day: 2, amount: 20 }, { day: 1, amount: 10 }] 
    });

    const charts = store.charts();
    expect(charts.length).toBe(4);
    
    const dailyData = store.dailyChartData();
    expect(dailyData.labels[0]).toBe('Day 1');
    
    expect(store.categoryChartData().datasets[0].backgroundColor).toContain('red');
  });

  it('should correctly compute footer statistics', () => {
    patchState(store, {
      summary: { totalIncome: 1000, totalExpenses: 1200 }, 
      categories: [
        { category: 'Rent', amount: 1000 },
        { category: 'Food', amount: 200 }
      ],
      savingsTrend: [
        { month: 'Jan', savings: 100 },
        { month: 'Feb', savings: 300 }
      ],
      dailySpending: [
        { day: 1, amount: 10 },
        { day: 2, amount: 50 },
        { day: 3, amount: 30 }
      ]
    });

    expect(store.incomeVsExpensesFooter()?.isNetPositive).toBe(false);
    expect(store.topCategoriesFooter()[0].category).toBe('Rent');
    expect(store.savingsFooter()?.average).toContain('200'); 
    expect(store.dailySpendingFooter()?.highest).toContain('50');
    expect(store.dailySpendingFooter()?.lowest).toContain('10');
  });

  it('should handle various error statuses in loadAllData', () => {
    const errorScenarios = [
      { status: 401, message: 'Session expired' },
      { status: 500, message: 'Server is currently unavailable' },
      { status: 404, message: 'unexpected error' }
    ];

    errorScenarios.forEach(scenario => {
      service.getSummary.mockReturnValue(throwError(() => ({ status: scenario.status })));
      store.loadAllData({ from: '2026-01-01' });
      expect(store.error().toLowerCase()).toContain(scenario.message.toLowerCase());
    });
  });

  it('should handle null summary response', () => {
    service.getSummary.mockReturnValue(of(null));
    service.getCategories.mockReturnValue(of([]));
    service.getDailySpending.mockReturnValue(of([]));
    service.getIncomeVsExpenses.mockReturnValue(of([]));
    service.getSavingsTrend.mockReturnValue(of([]));
    service.getRecentTransactions.mockReturnValue(of([]));

    store.loadAllData({ from: '2026-01-01' });

    expect(store.error()).toBe('No data found for this period');
    expect(store.summaryCards()).toEqual([]);
  });
});