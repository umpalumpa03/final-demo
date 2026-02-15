export const REGISTATION_FORM = {
  firstName: {
    label: 'auth.sign-up.firstname',
    required: false,
    placeholder: 'John',
  },
  lastName: {
    label: 'auth.sign-up.lastname',
    required: false,
    placeholder: 'Doe',
  },
  email: {
    label: 'auth.sign-up.email',
    required: false,
    placeholder: 'john@example.com',
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
  birthDate: {
    label: 'auth.sign-up.birthDate',
    required: false,
    min: '1990-01-01',
    max: '2008-12-31',
    errorMessage: 'You must be at least 18 years old',
  },
} as const;

export const PASSWORD_RULE_MESSAGES = {
  minLength: 'At least 8 characters',
  uppercaseLowercase: 'Use uppercase and lowercase letters',
  number: 'Include at least one number',
  special: 'Include a special character',
} as const;

export const PASSWORD_RULES = {
  minLength: true,
  uppercase: true,
  lowercase: true,
  number: true,
  special: true,
} as const;
