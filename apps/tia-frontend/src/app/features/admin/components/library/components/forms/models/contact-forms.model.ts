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
  country: string;
  birthDate: string;
}

export interface ITwoColumnLayout extends ICommonForm {
  phone: string;
}

export interface IHorizontalLayout extends ICommonForm {
  message: string;
}

export const COUNTRIES = [
  { code: 'us', label: 'United States' },
  { code: 'ca', label: 'Canada' },
  { code: 'uk', label: 'United Kingdom' },
  { code: 'de', label: 'Germany' },
  { code: 'fr', label: 'France' },
  { code: 'au', label: 'Australia' },
  { code: 'other', label: 'Other' },
] as const;
