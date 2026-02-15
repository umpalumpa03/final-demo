export const paybillInputConfig = {
  accountNumber: {
    label: 'paybill.main.form.account_label',
    placeholder: 'paybill.main.form.account_placeholder',
    errorMessage: 'paybill.main.form.account_error',
  },
  amount: {
    label: 'paybill.main.form.amount_label',
    placeholder: '0.00',
    min: 10,
    max: 9999,
    required: true,
    errorMessage: 'paybill.main.form.amount_range_error',
    validation: {
      pattern: /^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
    },
  },
} as const;
