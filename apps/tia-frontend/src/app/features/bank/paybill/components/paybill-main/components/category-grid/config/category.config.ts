export interface CategoryUI {
  subtitle: string;
  iconBgColor: string;
  iconBgPath: string;
}

export const CATEGORY_UI_MAP: Record<string, CategoryUI> = {
  phone: {
    subtitle: 'Mobile & Data',
    iconBgColor: '#00C950',
    iconBgPath: '/images/svg/paybill/phone.svg',
  },
  internet: {
    subtitle: 'Fiber & ADSL',
    iconBgColor: '#2B7FFF',
    iconBgPath: '/images/svg/paybill/internet.svg',
  },
  utilities: {
    subtitle: 'Water & Electricity',
    iconBgColor: '#F0B100',
    iconBgPath: '/images/svg/paybill/utilities.svg',
  },
  insurance: {
    subtitle: 'Health & Life',
    iconBgColor: '#FB2C36',
    iconBgPath: '/images/svg/paybill/insurance.svg',
  },
  rent: {
    subtitle: 'Home & Office',
    iconBgColor: '#615FFF',
    iconBgPath: '/images/svg/paybill/rent.svg',
  },
} as const;

export const DEFAULT_CATEGORY_UI: CategoryUI = {
  subtitle: 'Pay your bill',
  iconBgColor: '#F5F5F5',
  iconBgPath: '/images/svg/paybill/utilities.svg',
} as const;
