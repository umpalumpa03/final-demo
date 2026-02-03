export const paybillInputConfig = {
  accountNumber: {
    label: 'paybill.main.form.account_label',
    placeholder: 'paybill.main.form.account_placeholder',
    errorMessage: 'paybill.main.form.account_error',
  },
  amount: {
    label: 'paybill.main.form.amount_label',
    placeholder: '0.00',
    min: 0,
    max: 9999,
    required: true,
    errorMessage: 'paybill.main.form.amount_range_error',
  },
} as const;
