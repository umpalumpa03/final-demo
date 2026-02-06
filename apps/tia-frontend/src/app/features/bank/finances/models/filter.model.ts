import { ChartData, ChartType } from "chart.js";
import { ButtonVariant } from "../../../../shared/lib/primitives/button/button.model";

export type FilterType = 'month' | 'custom';

export interface FinancesParams {
  fromValue: string;  
  toValue?: string; 
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FilterOption {
  label: string;
  icon: string;
  type: FilterType;
  variant:ButtonVariant;
  activeIcon:string,
}

export interface SummaryCard {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  comparisonLabel: string;
}

export interface FinancialSummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
  savingsRateChange: number;
}

export interface ChartConfig {
  title: string;
  type: ChartType; 
  data: ChartData<ChartType> | undefined;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  icon?: string;
  color: string;
  isImageIcon?: boolean;
}

export interface IncomeVsExpenses {
  month: string;
  income: number;
  expenses: number;
}

export interface SavingsTrend {
  month: string;
  savings: number;
}

export interface DailySpending {
  day: number;
  amount: number;
}

export interface Transaction {
  id: string;      
  title: string;   
  category: string;
  amount: number;  
  date: string;   
  type: 'expense' | 'income'; 
  icon?:string;
  isImageIcon?: boolean;
  categoryColor?: string;
  statusIcon?: string;
}

export interface IncomeVsExpensesFooter {
  income: string;
  expenses: string;
  net: string;
  isNetPositive: boolean;
}

export interface SavingsFooter {
  current: string;
  average: string;
  period: number;
}

export interface DailySpendingFooter {
  average: string;
  highest: string;
  lowest: string;
}

export interface TopCategoryFooter {
  category: string;
  amount: number;
  color: string;
  formattedAmount: string;
  percentage: string;
  icon?: string;
  isImageIcon?: boolean;
}