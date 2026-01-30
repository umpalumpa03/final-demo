import { RadioOption } from '../models/prepayment.model';

export const PREPAYMENT_CALC_OPTIONS: RadioOption[] = [
  {
    label: 'Reduce Monthly Payment',
    value: 'reduceMonthlyPayment',
    description: 'Lower your monthly payment amount',
  },
  {
    label: 'Reduce End Date of Loan',
    value: 'reduceEndDateOfLoan',
    description: 'Shorten the loan term',
  },
] as const;

export const PREPAYMENT_FORM_CONFIG = {
  typeSelect: {
    label: 'Prepayment Type *',
    height: '3.6rem',
    placeholder: 'Select type',
  },

  amountInput: {
    label: 'Prepayment Amount *',
    placeholder: '500',
    prefixIcon: './images/svg/feature-loans/dollar.svg',
  },

  calculationRadios: {
    label: 'Calculation Option *',
    hasBorder: true,
    layout: 'column',
  },
} as const;

export const PREPAYMENT_CURRENCY_KEYWORDS = [
  'amount',
  'savings',
  'principal',
  'interest',
  'discount',
  'monthly payment',
] as const;
