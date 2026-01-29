import { FilterOption } from '../models/filter.model';

export const FINANCES_FILTER_OPTIONS: FilterOption[] = [
  { 
    label: 'By Month', 
    icon: 'finances-bymonth.svg', 
    type: 'month',
    variant:"default",
  },
  { 
    label: 'Custom Date', 
    icon: 'finances-bymonthwhite.svg', 
    type: 'custom',
    variant:"outline",
}
] as const;



export const CARDS_CONFIG = [
  { label: 'Total Income', key: 'totalIncome', changeKey: 'incomeChange', icon: 'finances-rate', type: 'positive', isPct: false, dynamicType: false },
  { label: 'Total Expenses', key: 'totalExpenses', changeKey: 'expensesChange', icon: 'finances-expenses', type: 'negative', isPct: false, dynamicType: false },
  { label: 'Total Savings', key: 'totalSavings', changeKey: 'savingsChange', icon: 'finances-saving', type: 'positive', isPct: false, dynamicType: true },
  { label: 'Savings Rate', key: 'savingsRate', changeKey: 'savingsRateChange', icon: 'finances-saving-rate', type: 'positive', isPct: true, dynamicType: false }
] as const;



