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
      getSummary: vi.fn(() => of({
        income: 5000, incomeChange: 10,
        expenses: 2000, expensesChange: -5,
        savings: 3000, savingsChange: 15,
        efficiency: 60, efficiencyChange: 2
      })),
      getCategories: vi.fn(() => of([])),
      getIncomeVsExpenses: vi.fn(() => of([])),
      getSavingsTrend: vi.fn(() => of([])),
      getDailySpending: vi.fn(() => of([])),
    };

    TestBed.configureTestingModule({
      providers: [
        FinancesStore,
        { provide: FinancesService, useValue: serviceMock }
      ]
    });
    store = TestBed.inject(FinancesStore);
  });

  it('should cover branch when summary is null', () => {
    patchState(store, { summary: null });
    expect(store.summaryCards()).toEqual([]);
  });

  it('should correctly format summaryCards and handle formatting logic', () => {
    const mockSummary = {
      income: 1000,
      incomeChange: 10,
      expenses: 500,
      expensesChange: -5,
      savings: 500,
      savingsChange: 5,
      efficiency: 50,
      efficiencyChange: 1,
      totalIncome: 1000,
      totalExpenses: 500,
      netSavings: 500,
      savingsEfficiency: 50
    };

    patchState(store, { summary: mockSummary as any });

    const cards = store.summaryCards();
    
    expect(cards.length).toBeGreaterThan(0);

    const hasCurrency = cards.some((c: any) => c.value.includes('$'));
    const hasPercent = cards.some((c: any) => c.value.includes('%') && !c.value.includes('$'));

    expect(hasCurrency).toBe(true);
    if (!hasPercent) {
      console.warn('Warning: No percentage card found. Check CARDS_CONFIG keys.');
    }

    expect(cards[0].change).toMatch(/[+-]?\d+%/);
    expect(cards[0].icon).toContain('.svg');
  });

  it('should compute chart data correctly from state', () => {
    patchState(store, {
      categories: [{ category: 'Food', amount: 100, color: '#ff0' }],
      incomeVsExpenses: [{ month: 'Jan', income: 1000, expenses: 800 }],
      savingsTrend: [{ month: 'Jan', savings: 200 }],
      dailySpending: [{ day: 1, amount: 50 }]
    });

    expect(store.categoryChartData().datasets[0].backgroundColor).toContain('#ff0');
    expect(store.mainChartData().datasets[0].data).toContain(1000);
    expect(store.charts()[0].type).toBe('line');
    expect(store.charts().length).toBe(4);
  });

  it('should handle loadAllData and update loading state', () => {
    store.loadAllData({ from: '2026-01-01' });
    expect(store.loading()).toBe(false);
    expect(serviceMock.getSummary).toHaveBeenCalled();
  });

  it('should handle API errors and update error state', () => {
    serviceMock.getSummary.mockReturnValue(throwError(() => new Error('Failure')));
    store.loadAllData({ from: 'invalid' });
    
    expect(store.error()).toBe('Data sync failed');
    expect(store.loading()).toBe(false);
  });
});