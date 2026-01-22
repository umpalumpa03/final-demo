export interface IContactForm {
    name: string;
    email: string;
    message: string;
    subscribe: boolean
}

export interface IRegitrationForm {
    firstName: string;
    lastName: string;
    password: string;
    country: string;
    birthDate: string
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