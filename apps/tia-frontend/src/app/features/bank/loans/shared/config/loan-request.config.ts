import {
  SelectOption,
  TextInputType,
} from '@tia/shared/lib/forms/models/input.model';

export const LOAN_FORM_CONFIG = {
  amount: {
    label: 'Loan Amount',
    placeholder: '5000',
    required: true,
    prefixIcon: './images/svg/feature-loans/dollar.svg',
    type: 'number',
  },
  account: {
    label: 'Account to Receive Funds',
    placeholder: 'Select account',
    required: true,
    height: '3.6rem',
  },

  term: {
    label: 'Loan Term (Months)',
    placeholder: 'Select term',
    required: true,
    height: '3.6rem',
  },

  purpose: {
    label: 'Loan Purpose',
    placeholder: 'Select purpose',
    required: true,
    height: '3.6rem',
  },

  date: {
    label: 'First Payment Date',
    type: 'date' as TextInputType,
    required: true,
  },

  street: {
    label: 'Street Address',
    placeholder: '123 Main Street',
    required: true,
  },

  city: {
    label: 'City',
    placeholder: 'Tbilisi',
    required: true,
  },

  region: {
    label: 'Region',
    placeholder: 'Tbilisi Region',
    required: true,
  },

  postal: {
    label: 'Postal Code',
    placeholder: '0100',
    required: true,
    errorMessage: 'Invalid postal code.',
  },

  contactName: {
    label: 'Full Name',
    placeholder: 'John Doe',
    required: true,
  },

  contactRel: {
    label: 'Relationship',
    placeholder: 'Brother',
    required: true,
  },

  contactPhone: {
    label: 'Phone Number',
    placeholder: '591234567',
    required: true,
    errorMessage: 'Must be at least 9 digits (numbers only)',
    prefixIcon: './images/svg/feature-loans/phone.svg',
  },

  contactEmail: {
    label: 'Email Address',
    placeholder: 'john.doe@example.com',
    required: true,
    prefixIcon: './images/svg/feature-loans/mail.svg',
  },
} as const;

export const PURPOSE_OPTIONS: SelectOption[] = [
  { label: 'Home Improvement', value: 'home_improvement' },
  { label: 'Debt Consolidation', value: 'debt_consolidation' },
  { label: 'Auto Purchase', value: 'auto_purchase' },
  { label: 'Education', value: 'education' },
  { label: 'Other', value: 'other' },
] as const;

export const NUMBER_REGEX = '^[0-9]*$' as const;
