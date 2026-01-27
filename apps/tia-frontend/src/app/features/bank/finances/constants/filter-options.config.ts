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
];


export const summaryCards = [
    { label: 'Total Income', value: '$12,450', change: '+12%', changeType: 'positive' as const, icon: 'income-icon.svg' },
    { label: 'Total Expenses', value: '$8,200', change: '+5%', changeType: 'negative' as const, icon: 'expense-icon.svg' },
    { label: 'Total Savings', value: '$4,250', change: '+18%', changeType: 'positive' as const, icon: 'savings-icon.svg' },
    { label: 'Net Profit', value: '$2,100', change: '-2%', changeType: 'negative' as const, icon: 'profit-icon.svg' }
  ];

