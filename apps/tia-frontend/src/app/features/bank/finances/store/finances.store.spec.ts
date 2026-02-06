import { TestBed } from '@angular/core/testing';
import { FinancesStore } from './finances.store';
import { FinancesService } from '../services/finances.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { patchState } from '@ngrx/signals';

describe('FinancesStore', () => {
  let store: any;
  let serviceMock: any;

  beforeEach(() => {
    serviceMock = {
      getSummary: vi.fn(() => of({ totalIncome: 1000, incomeChange: 10, totalExpenses: 500, expensesChange: -5, totalSavings: 500, savingsChange: 5, savingsRate: 50, savingsRateChange: 1 })),
      getCategories: vi.fn(() => of([{ category: 'Food & Dining', amount: 100, color: '#ff0' }])),
      getRecentTransactions: vi.fn(() => of([{ id: '1', title: 'T1', amount: 50, category: 'Food & Dining', type: 'expense' }])),
      getIncomeVsExpenses: vi.fn(() => of([{ month: 'Jan', income: 100, expenses: 80 }])),
      getSavingsTrend: vi.fn(() => of([{ month: 'Jan', savings: 20 }])),
      getDailySpending: vi.fn(() => of([{ day: 1, amount: 10 }])),
    };
    TestBed.configureTestingModule({
      providers: [FinancesStore, { provide: FinancesService, useValue: serviceMock }]
    });
    store = TestBed.inject(FinancesStore);
  });

  it('should cover all computed logic and formatting', () => {
    store.loadAllData({ from: '2026-01-01', to: '2026-01-31' });

    const cards = store.summaryCards();
    expect(cards.length).toBe(4);
    expect(cards[0].value).toContain('$'); 
    expect(cards[3].value).toContain('%');

    const tx = store.transactionsWithIcons()[0];
    expect(tx.icon).toBeDefined();
    expect(store.categoriesWithIcons()[0].icon).toBeDefined();

    expect(store.charts().length).toBe(4);
    expect(store.mainChartData().datasets[0].data).toContain(100);
  });

  it('should handle error and null states', () => {
    serviceMock.getSummary.mockReturnValue(throwError(() => new Error()));
    store.loadAllData({ from: 'err' });
    expect(store.error()).toBe('Data sync failed');

    patchState(store, { summary: null });
    expect(store.summaryCards()).toEqual([]);
  });
});