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

  it('should return empty summaryCards when summary is null', () => {
    // ამოწმებს ხაზს: if (!storeData) return [];
    patchState(store, { summary: null });
    expect(store.summaryCards()).toEqual([]);
  });

  it('should correctly format summaryCards with all variations', () => {
    patchState(store, {
      summary: {
        income: 1000,
        incomeChange: 10,
        expenses: -500, // ტესტავს უარყოფით მნიშვნელობას dynamicType-ისთვის
        expensesChange: -5,
        savings: 500,
        savingsChange: 0,
        efficiency: 50,
        efficiencyChange: 1
      } as any
    });

    const cards = store.summaryCards();
    
    expect(cards).toHaveLength(4);
    
    // 1. ვალუტის ფორმატი (USD)

    
    // 2. პროცენტული ფორმატი (isPct: true)
    expect(cards[3].value).toBe('50%');
    
    // 3. Change ფორმატი (+ ნიშანი)
    expect(cards[0].change).toBe('+10%');
    
    // 4. dynamicType-ის ლოგიკა (პოზიტიური/ნეგატიური)
    // თუ income >= 0 -> positive
    expect(cards[0].changeType).toBe('positive');
    // თუ expenses < 0 (ზემოთ მივუთითეთ -500) -> negative
    expect(cards[1].changeType).toBe('negative');
  });

  it('should cover all chart data computations', () => {
    patchState(store, {
      categories: [{ category: 'Food', amount: 100, color: '#ff0' }],
      incomeVsExpenses: [{ month: 'Jan', income: 1000, expenses: 800 }],
      savingsTrend: [{ month: 'Jan', savings: 200 }],
      dailySpending: [{ day: 1, amount: 50 }]
    });

    // ამოწმებს თითოეული ჩარტის მეპინგს
    expect(store.categoryChartData().datasets[0].data).toContain(100);
    expect(store.mainChartData().labels).toContain('Jan');
    expect(store.savingsChartData().datasets[0].borderColor).toBe('#3B82F6');
    expect(store.dailyChartData().labels).toContain('Day 1');
    
    // ამოწმებს ერთიანი charts მასივის სტრუქტურას
    expect(store.charts().length).toBe(4);
    expect(store.charts()[1].type).toBe('pie');
  });

  it('should handle loadAllData success and update state', () => {
    store.loadAllData({ from: '2026-01-01', to: '2026-01-31' });
    
    // loadAllData იყენებს tap-ს და patchState-ს
    expect(store.loading()).toBe(false);
    expect(serviceMock.getSummary).toHaveBeenCalled();
  });

  it('should handle loadAllData error and set error state', () => {
    // catchError-ის დაფარვა
    serviceMock.getSummary.mockReturnValue(throwError(() => new Error('API Error')));
    
    store.loadAllData({ from: 'error-date' });

    expect(store.error()).toBe('Data sync failed');
    expect(store.loading()).toBe(false);
  });
});