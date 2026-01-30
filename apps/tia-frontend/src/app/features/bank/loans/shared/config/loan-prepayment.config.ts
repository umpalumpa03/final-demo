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
    label: 'loans.prepayment_wizard.form.type_label',
    height: '3.6rem',
    placeholder: 'loans.placeholders.select_type',
  },

  amountInput: {
    label: 'loans.prepayment_wizard.form.amount_label',
    placeholder: 'loans.placeholders.prepayment_amount',
    prefixIcon: './images/svg/feature-loans/dollar.svg',
  },

  calculationRadios: {
    label: 'loans.prepayment_wizard.form.calc_option_label',
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
