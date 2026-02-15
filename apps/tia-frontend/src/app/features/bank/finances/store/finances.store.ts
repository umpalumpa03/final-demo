import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withComputed,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { FinancesService } from '../services/finances.service';
import {
  pipe,
  tap,
  catchError,
  EMPTY,
  filter,
  exhaustMap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  FinancialSummaryResponse,
  CategoryBreakdown,
  IncomeVsExpenses,
  SavingsTrend,
  DailySpending,
  ChartConfig,
  SummaryCard,
  Transaction,
  TopCategoryFooter,
} from '../models/filter.model';
import {
  CARDS_CONFIG,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from '../config/filter-options.config';
import { ChartData } from 'chart.js';

export const FinancesStore = signalStore(
  withState({
    summary: null as FinancialSummaryResponse | null,
    categories: [] as CategoryBreakdown[],
    transactions: [] as Transaction[],
    incomeVsExpenses: [] as IncomeVsExpenses[],
    savingsTrend: [] as SavingsTrend[],
    dailySpending: [] as DailySpending[],
    loading: false,
    isRefreshing: false, 
    error: null as string | null,
  }),
  withMethods((store, service = inject(FinancesService)) => ({
    resetStore: () => {
      patchState(store, {
        summary: null,
        categories: [],
        transactions: [],
        incomeVsExpenses: [],
        savingsTrend: [],
        dailySpending: [],
        loading: false,
        isRefreshing: false,
        error: null,
      });
      service.clearCache();
    },

    loadAllData: rxMethod<{ from: string; to?: string; force?: boolean }>(
      pipe(
        filter((params) => !!params.from),
        tap(({ from, to, force }) => {
          if (force) {
            patchState(store, { isRefreshing: true });
          } else {
            patchState(store, { loading: true, error: null });
          }
        }),
        exhaustMap(({ from, to, force }) =>
          service.getFullFinancialData(from, to, !!force).pipe(
            tap((res) => {
              patchState(store, {
                ...res,
                loading: false,
                isRefreshing: false,
                error: res.summary ? null : 'No data found for this period',
              });
            }),
            catchError((err) => {
              let errorMessage = 'An unexpected error occurred';
              if (err.status === 401) errorMessage = 'Session expired. Please login again.';
              if (err.status === 500) errorMessage = 'Server is currently unavailable.';

              patchState(store, { 
                loading: false, 
                isRefreshing: false, 
                error: errorMessage 
              });
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
        const val = storeData[config.key as keyof FinancialSummaryResponse] as number;
        const changeVal = storeData[config.changeKey as keyof FinancialSummaryResponse] as number;

        const calculatedType = config.dynamicType
          ? val >= 0 ? 'positive' : 'negative'
          : config.type;

        return {
          label: config.label,
          value: config.isPct ? `${val}%` : formatUSD(val),
          change: `${changeVal >= 0 ? '+' : ''}${changeVal}%`,
          comparisonLabel: 'from last month',
          changeType: (calculatedType === 'positive' || calculatedType === 'negative') 
            ? calculatedType 
            : 'positive',
          icon: `/images/svg/finances/${config.icon}.svg`,
        };
      });
    });

    const categoryChartData = computed(
      (): ChartData<'pie'> => ({
        labels: store.categories().map((c) => c.category),
        datasets: [{
          data: store.categories().map((c) => c.amount),
          backgroundColor: store.categories().map((c) => c.color),
          borderWidth: 0,
        }],
      })
    );

    const mainChartData = computed(
      (): ChartData<'line'> => ({
        labels: store.incomeVsExpenses().map((i) => i.month),
        datasets: [
          {
            data: store.incomeVsExpenses().map((i) => i.income),
            label: 'Income',
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            data: store.incomeVsExpenses().map((i) => i.expenses),
            label: 'Expenses',
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      })
    );

    const savingsChartData = computed(
      (): ChartData<'line'> => ({
        labels: store.savingsTrend().map((s) => s.month),
        datasets: [{
          data: store.savingsTrend().map((s) => s.savings),
          label: 'Savings',
          borderColor: '#3B82F6',
          tension: 0.4,
        }],
      })
    );

    const dailyChartData = computed((): ChartData<'bar'> => {
      const sortedSpending = [...store.dailySpending()].sort((a, b) => a.day - b.day);
      return {
        labels: sortedSpending.map((d) => `Day ${d.day}`),
        datasets: [{
          data: sortedSpending.map((d) => d.amount),
          label: 'Spent',
          backgroundColor: '#8B5CF6',
          borderRadius: 4,
        }],
      };
    });

    const charts = computed((): ChartConfig[] => [
      { title: 'Income vs Expenses', type: 'line', data: mainChartData() },
      { title: 'Spending by Category', type: 'pie', data: categoryChartData() },
      { title: 'Savings Trend', type: 'line', data: savingsChartData() },
      { title: 'Daily Spending', type: 'bar', data: dailyChartData() },
    ]);

    const categoriesWithIcons = computed(() => {
      return store.categories().map((cat) => ({
        ...cat,
        color: cat.color === '#6B7280' && CATEGORY_COLORS[cat.category]
            ? CATEGORY_COLORS[cat.category]
            : cat.color,
        icon: CATEGORY_ICONS[cat.category] || cat.icon || '',
      }));
    });

    const transactionsWithIcons = computed(() => {
      return store.transactions().map((tx) => {
        let iconValue = CATEGORY_ICONS[tx.category];
        const categoryColor = CATEGORY_COLORS[tx.category] || '#6B7280';

        if (!iconValue) {
          iconValue = tx.type === 'income' ? CATEGORY_ICONS['Income'] : CATEGORY_ICONS['Expense'];
        }

        const finalIcon = iconValue || tx.icon || (tx.type === 'income' ? '💰' : '💸');
        const statusIconPath = `/images/svg/finances/finances-${tx.type === 'income' ? 'income-abs' : 'expense-abs'}.svg`;

        return {
          ...tx,
          icon: finalIcon,
          isImageIcon: typeof finalIcon === 'string' && finalIcon.startsWith('/'),
          statusIcon: statusIconPath,
          categoryColor,
        };
      });
    });

    const incomeVsExpensesFooter = computed(() => {
      const summary = store.summary();
      if (!summary) return null;
      const net = summary.totalIncome - summary.totalExpenses;
      return {
        income: formatUSD(summary.totalIncome),
        expenses: formatUSD(summary.totalExpenses),
        net: formatUSD(net),
        isNetPositive: net >= 0,
      };
    });

    const topCategoriesFooter = computed<TopCategoryFooter[]>(() => {
      const summary = store.summary();
      return [...store.categories()]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3)
        .map((cat) => ({
          ...cat,
          formattedAmount: formatUSD(cat.amount),
          percentage: summary?.totalExpenses
            ? ((cat.amount / summary.totalExpenses) * 100).toFixed(1)
            : '0',
        }));
    });

    const savingsFooter = computed(() => {
      const savingsData = store.savingsTrend();
      if (savingsData.length === 0) return null;

      const currentMonthSavings = savingsData[savingsData.length - 1].savings;
      const averageSavings = savingsData.reduce((acc, curr) => acc + curr.savings, 0) / savingsData.length;

      return {
        current: formatUSD(currentMonthSavings),
        average: formatUSD(averageSavings),
        period: savingsData.length,
      };
    });

    const dailySpendingFooter = computed(() => {
      const dailyData = store.dailySpending();
      if (dailyData.length === 0) return null;

      const amounts = dailyData.map((d) => d.amount);
      const average = amounts.reduce((acc, curr) => acc + curr, 0) / amounts.length;
      const highest = Math.max(...amounts);
      const lowest = Math.min(...amounts);

      return {
        average: formatUSD(average),
        highest: formatUSD(highest),
        lowest: formatUSD(lowest),
      };
    });

    return {
      summaryCards,
      charts,
      categoryChartData,
      mainChartData,
      savingsChartData,
      dailyChartData,
      categoriesWithIcons,
      transactionsWithIcons,
      incomeVsExpensesFooter,
      topCategoriesFooter,
      savingsFooter,
      dailySpendingFooter,
    };
  }),
);