export interface ICommonForm {
  firstName: string;
  lastName?: string;
  email?: string;
}

export interface IContactForm {
  name: string;
  email: string;
  message: string;
  subscribe: boolean;
}

export interface IRegistrationForm extends ICommonForm {
  password: string;
  username: string;
}

export interface ITwoColumnLayout extends ICommonForm {
  phone: string;
}

export interface IHorizontalLayout extends ICommonForm {
  message: string;
}

export interface ISettingsForm {
  plan: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface IStepConfig {
  label: string;
  key: string;
}

export type PasswordStrength =
  | 'auth.sign-up.weak'
  | 'auth.sign-up.fair'
  | 'auth.sign-up.good'
  | 'auth.sign-up.strong';
