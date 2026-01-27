export interface CategoryUI {
  iconBgColor: string;
  iconBgPath: string;
}

export const CATEGORY_UI_MAP: Record<string, CategoryUI> = {
  phone: {
    iconBgColor: '#00C950',
    iconBgPath: '/images/svg/paybill/phone.svg',
  },
  internet: {
    iconBgColor: '#2B7FFF',
    iconBgPath: '/images/svg/paybill/internet.svg',
  },
  utilities: {
    iconBgColor: '#F0B100',
    iconBgPath: '/images/svg/paybill/utilities.svg',
  },
  insurance: {
    iconBgColor: '#FB2C36',
    iconBgPath: '/images/svg/paybill/insurance.svg',
  },
  rent: {
    iconBgColor: '#615FFF',
    iconBgPath: '/images/svg/paybill/rent.svg',
  },
} as const;

export const DEFAULT_CATEGORY_UI: CategoryUI = {
  iconBgColor: '#F5F5F5',
  iconBgPath: '/images/svg/paybill/utilities.svg',
} as const;
