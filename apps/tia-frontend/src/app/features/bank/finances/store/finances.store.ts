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
  DailySpending,
  ChartConfig,
  SummaryCard 
} from '../models/filter.model';
import { CARDS_CONFIG } from '../config/filter-options.models'; 
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
  withComputed((store) => {
    const formatUSD = (value: number) => 
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(value);

    const summaryCards = computed((): SummaryCard[] => {
      const storeData = store.summary();
      if (!storeData) return [];

      return CARDS_CONFIG.map((config) => {
        const val = storeData[config.key] as number;
        const changeVal = storeData[config.changeKey] as number;
        
        const calculatedType = config.dynamicType
          ? val >= 0 ? 'positive' : 'negative'
          : config.type;

        return {
          label: config.label,
          value: config.isPct ? `${val}%` : formatUSD(val),
          change: `${changeVal >= 0 ? '+' : ''}${changeVal}%`,
          changeType: (calculatedType === 'positive' || calculatedType === 'negative') ? calculatedType : 'positive',
          icon: `images/svg/cards/${config.icon}.svg`,
        };
      });
    });

    const categoryChartData = computed((): ChartData<'pie'> => ({
      labels: store.categories().map(c => c.category),
      datasets: [{
        data: store.categories().map(c => c.amount),
        backgroundColor: store.categories().map(c => c.color),
        borderWidth: 0
      }]
    }));

    const mainChartData = computed((): ChartData<'line'> => ({
      labels: store.incomeVsExpenses().map(i => i.month),
      datasets: [
        { data: store.incomeVsExpenses().map(i => i.income), label: 'Income', borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 },
        { data: store.incomeVsExpenses().map(i => i.expenses), label: 'Expenses', borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.4 }
      ]
    }));

    const savingsChartData = computed((): ChartData<'line'> => ({
      labels: store.savingsTrend().map(s => s.month),
      datasets: [{ data: store.savingsTrend().map(s => s.savings), label: 'Savings', borderColor: '#3B82F6', tension: 0.4 }]
    }));

    const dailyChartData = computed((): ChartData<'bar'> => ({
      labels: store.dailySpending().map(d => `Day ${d.day}`),
      datasets: [{ data: store.dailySpending().map(d => d.amount), label: 'Spent', backgroundColor: '#8B5CF6', borderRadius: 4 }]
    }));

    const charts = computed((): ChartConfig[] => [
      { title: 'Income vs Expenses', type: 'line', data: mainChartData() },
      { title: 'Spending by Category', type: 'pie', data: categoryChartData() },
      { title: 'Savings Trend', type: 'line', data: savingsChartData() },
      { title: 'Daily Spending', type: 'bar', data: dailyChartData() }
    ]);

    return {
      summaryCards, 
      charts,
      categoryChartData,
      mainChartData,
      savingsChartData,
      dailyChartData,
    };
  })
);