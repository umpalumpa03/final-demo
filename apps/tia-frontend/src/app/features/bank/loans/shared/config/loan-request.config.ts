export const LOAN_FORM_CONFIG = {
  amount: {
    label: 'Loan Amount',
    placeholder: '$ 5000',
    required: true,
    type: 'number',
  },

  term: {
    label: 'Loan Term (Months)',
    placeholder: 'Select term',
    required: true,
  },

  purpose: {
    label: 'Loan Purpose',
    placeholder: 'Select purpose',
    required: true,
  },

  date: {
    label: 'First Payment Date',
    type: 'date',
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
  },

  contactEmail: {
    label: 'Email Address',
    placeholder: 'john.doe@example.com',
    required: true,
  },
};
