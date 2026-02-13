import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  FinancialSummaryResponse,
  CategoryBreakdown,
  IncomeVsExpenses,
  SavingsTrend,
  DailySpending,
  Transaction,
  FullFinancialData,
} from '../models/filter.model';
import { FinancesService } from '../services/finances.service';

export const mockSummary: FinancialSummaryResponse = {
  totalIncome: 5000,
  totalExpenses: 3000,
  totalSavings: 2000,
  savingsRate: 40,
  incomeChange: 10,
  expensesChange: -5,
  savingsChange: 15,
  savingsRateChange: 5,
};

export const mockCategories: CategoryBreakdown[] = [
  {
    category: 'Food & Dining',
    amount: 800,
    percentage: 26.67,
    color: '#3B82F6',
    icon: '/images/svg/finances/finances-food.svg',
  },
  {
    category: 'Shopping',
    amount: 600,
    percentage: 20,
    color: '#10B981',
    icon: '/images/svg/finances/finances-shopping.svg',
  },
  {
    category: 'Transportation',
    amount: 400,
    percentage: 13.33,
    color: '#F59E0B',
    icon: '/images/svg/finances/finances-transport.svg',
  },
];

export const mockIncomeVsExpenses: IncomeVsExpenses[] = [
  { month: 'Jan', income: 4500, expenses: 2800 },
  { month: 'Feb', income: 5000, expenses: 3000 },
  { month: 'Mar', income: 4800, expenses: 2900 },
];

export const mockSavingsTrend: SavingsTrend[] = [
  { month: 'Jan', savings: 1700 },
  { month: 'Feb', savings: 2000 },
  { month: 'Mar', savings: 1900 },
];

export const mockDailySpending: DailySpending[] = [
  { day: 1, amount: 100 },
  { day: 2, amount: 150 },
  { day: 3, amount: 80 },
  { day: 4, amount: 120 },
  { day: 5, amount: 200 },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Grocery Store',
    category: 'Food & Dining',
    amount: 85.5,
    date: '2026-02-01',
    type: 'expense',
    icon: '/images/svg/finances/finances-food.svg',
  },
  {
    id: 'tx-2',
    title: 'Salary',
    category: 'Income',
    amount: 5000,
    date: '2026-02-01',
    type: 'income',
    icon: '/images/svg/finances/finances-income-abs.svg',
  },
  {
    id: 'tx-3',
    title: 'Gas Station',
    category: 'Transportation',
    amount: 45,
    date: '2026-01-31',
    type: 'expense',
    icon: '/images/svg/finances/finances-transport.svg',
  },
];

export const mockFullFinancialData: FullFinancialData = {
  summary: mockSummary,
  categories: mockCategories,
  dailySpending: mockDailySpending,
  incomeVsExpenses: mockIncomeVsExpenses,
  savingsTrend: mockSavingsTrend,
  transactions: mockTransactions,
};

export interface FinancesTestContext {
  httpMock: HttpTestingController;
  service: FinancesService;
}

export async function setupFinancesTest(): Promise<FinancesTestContext> {
  await TestBed.configureTestingModule({
    providers: [
      provideTranslateService(),
      provideHttpClient(),
      provideHttpClientTesting(),
      FinancesService,
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const service = TestBed.inject(FinancesService);

  return { httpMock, service };
}

export function cleanupFinancesTest(httpMock: HttpTestingController): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
