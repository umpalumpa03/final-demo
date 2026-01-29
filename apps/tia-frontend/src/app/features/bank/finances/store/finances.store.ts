import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { FinancesService } from '../services/finances.service';
import { pipe, switchMap, tap, catchError, EMPTY, forkJoin } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { 
  FinancialSummaryResponse, 
  CategoryBreakdown, 
  IncomeVsExpenses, 
  SavingsTrend, 
  DailySpending 
} from '../models/filter.model';
import { ChartData } from 'chart.js';

export const FinancesStore = signalStore(
  withState({
    summary: null as FinancialSummaryResponse | null,
    categories: [] as CategoryBreakdown[],
    incomeVsExpenses: [] as IncomeVsExpenses[],
    savingsTrend: [] as SavingsTrend[],
    dailySpending: [] as DailySpending[],
    loading: false,
    error: null as string | null,
  }),
  withMethods((store, service = inject(FinancesService)) => ({
    loadAllData: rxMethod<{ from: string; to?: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ from, to }) =>
          forkJoin({
            summary: service.getSummary(from, to),
            categories: service.getCategories(from, to),
            incomeVsExpenses: service.getIncomeVsExpenses(),
            savingsTrend: service.getSavingsTrend(),
            dailySpending: service.getDailySpending(from, to)
          }).pipe(
            tap((res) => patchState(store, { ...res, loading: false })),
            catchError(() => {
              patchState(store, { loading: false, error: 'Data sync failed' });
              return EMPTY;
            })
          )
        )
      )
    ),
  })),
  withComputed(({ categories, incomeVsExpenses, savingsTrend, dailySpending }) => ({
    categoryChartData: computed((): ChartData<'pie'> => ({
      labels: categories().map(c => c.category),
      datasets: [{
        data: categories().map(c => c.amount),
        backgroundColor: categories().map(c => c.color),
        borderWidth: 0
      }]
    })),

    mainChartData: computed((): ChartData<'line'> => ({
      labels: incomeVsExpenses().map(i => i.month),
      datasets: [
        { data: incomeVsExpenses().map(i => i.income), label: 'Income', borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 },
        { data: incomeVsExpenses().map(i => i.expenses), label: 'Expenses', borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.4 }
      ]
    })),

    savingsChartData: computed((): ChartData<'line'> => ({
      labels: savingsTrend().map(s => s.month),
      datasets: [{ data: savingsTrend().map(s => s.savings), label: 'Savings', borderColor: '#3B82F6', tension: 0.4 }]
    })),

    dailyChartData: computed((): ChartData<'bar'> => ({
      labels: dailySpending().map(d => `Day ${d.day}`),
      datasets: [{ data: dailySpending().map(d => d.amount), label: 'Spent', backgroundColor: '#8B5CF6', borderRadius: 4 }]
    }))
  }))
);