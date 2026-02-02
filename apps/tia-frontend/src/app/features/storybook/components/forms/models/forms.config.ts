export const COUNTRY_OPTIONS = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Australia', value: 'au' },
  { label: 'Other', value: 'other' },
];

export const REGISTATION_FORM = {
  firstName: {
    label: 'auth.sign-up.firstname',
    required: false,
    placeholder: 'Jhon',
  },
  lastName: {
    label: 'auth.sign-up.lastname',
    required: false,
    placeholder: 'Doe',
  },
  email: {
    label: 'auth.sign-up.email',
    required: false,
    placeholder: 'jonh@example.com',
  },
  password: {
    label: 'auth.sign-up.password',
    required: false,
    placeholder: '••••••••',
  },
  confirmPassword: {
    label: 'auth.sign-up.confirmPassword',
    required: false,
    placeholder: '••••••••',
    errorMessage: 'Passwords do not match',
  },
  username: {
    label: 'auth.sign-up.username',
    required: false,
    placeholder: 'Johndoe',
  },
} as const;

export const PASSWORD_RULE_MESSAGES = {
  minLength: 'At least 8 characters',
  uppercaseLowercase: 'Use uppercase and lowercase letters',
  number: 'Include at least one number',
  special: 'Include a special character',
} as const;

export const CONTACT_FORM = {
  name: {
    label: 'Name',
    required: true,
    placeholder: 'Your Name',
  },
  email: {
    label: 'Email',
    required: true,
    placeholder: 'your.email@example.com',
  },
  message: {
    label: 'Message',
    required: true,
    placeholder: 'Type your message here...',
  },
  checkbox: {
    label: 'Subscribe to newsletter',
    required: true,
  },
} as const;

export const INLINE_FORM = {
  message: {
    required: false,
    placeholder: 'jonh@example.com',
  },
} as const;

export const ROW_FORM = {
  firstName: {
    label: 'First Name',
    placeholder: 'Jhon',
  },
  lastName: {
    label: 'Last Name',
    placeholder: 'Doe',
  },
  email: {
    label: 'Email',
    placeholder: 'jonh@example.com',
  },
  phone: {
    label: 'Phone',
    placeholder: '+1 (555) 000-0000',
  },
} as const;

export const HORIZONTAL_FORM = {
  firstName: {
    placeholder: 'Jhon',
  },
  message: {
    placeholder: 'Doe',
  },
  email: {
    placeholder: 'jonh@example.com',
  },
} as const;

export const STEP_FORM = [
  { label: 'From', key: 'from' },
  { label: 'To', key: 'to' },
  { label: 'Amount', key: 'amount' },
];

export const MULTI_FORM = {
  name: {
    label: 'Name',
    required: true,
    placeholder: 'Your Name',
  },
  bio: {
    label: 'Message',
    required: true,
    placeholder: 'Type your message here...',
  },
} as const;

export const PLAN_OPTION = [
  {
    label: 'Free',
    value: 'free',
    description: 'Basic features',
    initialValue: true,
  },
  {
    label: 'Pro',
    value: 'pro',
    description: 'Advanced features - $9.99/month',
  },
  {
    label: 'Enterprise',
    value: 'enterprise',
    description: 'All features - $29.99/month',
  },
];

export const VALIDATION_FORM = {
  success: {
    label: 'Valid Input',
    successMessage: 'Email format is correct',
  },
  error: {
    label: 'Invalid Input',
    errorMessage: 'Please enter a valid email address',
  },
  warning: {
    label: 'Warning Input',
    warningMessage: 'Temporary email addresses may not receive notifications',
  },
};

export const PASSWORD_RULES = {
  minLength: true,
  uppercase: true,
  lowercase: true,
  number: true,
  special: true,
} as const;
