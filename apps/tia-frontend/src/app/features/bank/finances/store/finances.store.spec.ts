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
      getSummary: vi.fn(() => of({})),
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

  it('should update state and cover computed chart logic', () => {
    patchState(store, {
      categories: [{ category: 'Food', amount: 100, color: '#ff0' }],
      incomeVsExpenses: [{ month: 'Jan', income: 1000, expenses: 800 }],
      savingsTrend: [{ month: 'Jan', savings: 200 }],
      dailySpending: [{ day: 1, amount: 50 }]
    });

    expect(store.categoryChartData().labels).toContain('Food');
    expect(store.mainChartData().datasets[0].label).toBe('Income');
    expect(store.savingsChartData().datasets[0].data).toContain(200);
    expect(store.dailyChartData().labels).toContain('Day 1');
  });

  it('should handle loadAllData success path', () => {
    store.loadAllData({ from: '2026-01-01' });
    expect(serviceMock.getSummary).toHaveBeenCalled();
    expect(store.loading()).toBe(false);
  });

  it('should handle loadAllData error path (catchError coverage)', () => {
    serviceMock.getSummary.mockReturnValue(throwError(() => new Error('API Error')));
    
    store.loadAllData({ from: 'error-date' });

    expect(store.error()).toBe('Data sync failed');
    expect(store.loading()).toBe(false);
  });
});