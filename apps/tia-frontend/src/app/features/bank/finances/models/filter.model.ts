import { ButtonVariant } from "../../../../shared/lib/primitives/button/button.model";

export type FilterType = 'month' | 'custom';

export interface FinancesParams {
  fromValue: string;  
  toValue?: string; 
}

export interface FilterOption {
  label: string;
  icon: string;
  type: FilterType;
  variant:ButtonVariant;
}

export interface SummaryCard {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
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