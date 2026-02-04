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
  { label: 'Total Income', key: 'totalIncome', changeKey: 'incomeChange', icon: 'finances-cards-income', type: 'positive', isPct: false, dynamicType: false },
  { label: 'Total Expenses', key: 'totalExpenses', changeKey: 'expensesChange', icon: 'finances-cards-expense', type: 'negative', isPct: false, dynamicType: false },
  { label: 'Total Savings', key: 'totalSavings', changeKey: 'savingsChange', icon: 'finances-card-savings', type: 'positive', isPct: false, dynamicType: true },
  { label: 'Savings Rate', key: 'savingsRate', changeKey: 'savingsRateChange', icon: 'finances-cards-rate', type: 'positive', isPct: true, dynamicType: false }
] as const;


export const CATEGORY_ICONS: Record<string, string> = {
  'Food & Dining': '/images/svg/finances/finances-food.svg',
  'Shopping': '/images/svg/finances/finances-shopping.svg',
  'Transportation': '/images/svg/finances/finances-transport.svg',
  'Transfer': '/images/svg/finances/finances-transfer.svg',
  'Bills & Utilities': '/images/svg/finances/finances-bills.svg',
  'Entertainment': '/images/svg/finances/finances-entertainment.svg',
  'Income': '/images/svg/finances/finances-income.svg',
  'Expense':'images/svg/finances/finances-expense.svg',
  'Other': '/images/svg/finances/finances-other.svg',

} as const;

