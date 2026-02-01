import {
  SelectOption,
  TextInputType,
} from '@tia/shared/lib/forms/models/input.model';

export const LOAN_FORM_CONFIG = {
  amount: {
    label: 'loans.request.details.amount',
    placeholder: 'loans.placeholders.amount_ex',
    required: true,
    prefixIcon: './images/svg/feature-loans/dollar.svg',
    type: 'number',
  },
  account: {
    label: 'loans.request.details.account',
    placeholder: 'loans.placeholders.select_account',
    required: true,
    height: '3.6rem',
  },
  term: {
    label: 'loans.request.details.term',
    placeholder: 'loans.placeholders.select_term',
    required: true,
    height: '3.6rem',
  },
  purpose: {
    label: 'loans.request.details.purpose',
    placeholder: 'loans.placeholders.select_purpose',
    required: true,
    height: '3.6rem',
  },
  date: {
    label: 'loans.request.details.date',
    type: 'date' as TextInputType,
    required: true,
  },
  street: {
    label: 'loans.request.address.street',
    placeholder: 'loans.placeholders.street_ex',
    required: true,
  },
  city: {
    label: 'loans.request.address.city',
    placeholder: 'loans.placeholders.city_ex',
    required: true,
  },
  region: {
    label: 'loans.request.address.region',
    placeholder: 'loans.placeholders.region_ex',
    required: true,
  },
  postal: {
    label: 'loans.request.address.postal',
    placeholder: 'loans.placeholders.postal_ex',
    required: true,
    errorMessage: 'loans.validation.postal_error',
  },
  contactName: {
    label: 'loans.request.person.name',
    placeholder: 'loans.placeholders.name_ex',
    required: true,
  },
  contactRel: {
    label: 'loans.request.person.relationship',
    placeholder: 'loans.placeholders.relation_ex',
    required: true,
  },
  contactPhone: {
    label: 'loans.request.person.number',
    placeholder: 'loans.placeholders.phone_ex',
    required: true,
    errorMessage: 'loans.validation.phone_error',
    prefixIcon: './images/svg/feature-loans/phone.svg',
  },
  contactEmail: {
    label: 'loans.request.person.email',
    placeholder: 'loans.placeholders.email_ex',
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
