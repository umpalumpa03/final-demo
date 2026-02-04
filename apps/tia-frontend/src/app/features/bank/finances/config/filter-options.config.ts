import { FilterOption, SelectOption } from '../models/filter.model';

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



export const getMonthOptions = (activeMonths: string[] = []): SelectOption[] => {
  const allMonths: SelectOption[] = [
    { label: 'February 2026', value: '2026-02-01' },
    { label: 'January 2026', value: '2026-01-01' },
    { label: 'December 2025', value: '2025-12-01' },
    { label: 'November 2025', value: '2025-11-01' },
    { label: 'October 2025', value: '2025-10-01' },
    { label: 'September 2025', value: '2025-09-01' },
    { label: 'August 2025', value: '2025-08-01' },
    { label: 'July 2025', value: '2025-07-01' },
    { label: 'June 2025', value: '2025-06-01' },
    { label: 'May 2025', value: '2025-05-01' },
    { label: 'April 2025', value: '2025-04-01' },
    { label: 'March 2025', value: '2025-03-01' },
    { label: 'February 2025', value: '2025-02-01' },
  ] as const;

  if (!activeMonths || activeMonths.length === 0) {
    return allMonths;
  }

  return allMonths.filter(month => {
    const date = new Date(month.value as string);
    const shortMonthName = date.toLocaleString('en-US', { month: 'short' });

    return activeMonths.includes(shortMonthName);
  });
};