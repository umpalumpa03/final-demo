import { SettingsNavItem } from "../models/settings-header.model";

export const SETTINGS_NAV_CONFIG: SettingsNavItem[] = [
  {
    routerLink: 'appearance',
    src: 'images/svg/settings/appearance.svg',
    alt: 'appearance icon',
    translateString: 'settings.sections.appearance'
  },
  {
    routerLink: 'language',
    src: 'images/svg/settings/language.svg',
    alt: 'language icon',
    translateString: 'settings.sections.language'
  },
  {
    routerLink: 'profile-photo',
    src: 'images/svg/settings/profile-photo.svg',
    alt: 'profile photo icon',
    translateString: 'settings.sections.profile-photo'
  },
  {
    routerLink: 'accounts',
    src: 'images/svg/settings/accounts.svg',
    alt: 'accounts icon',
    translateString: 'settings.sections.accounts'
  },
  {
    routerLink: 'security',
    src: 'images/svg/settings/security.svg',
    alt: 'security icon',
    translateString: 'settings.sections.security'
  },
  {
    routerLink: 'user-management',
    src: 'images/svg/settings/user-management.svg',
    alt: 'user management icon',
    translateString: 'settings.sections.user-management'
  }
] as const;

export const SETTINGS_NAV_ADMIN_CONFIG: SettingsNavItem[] = [
  {
    routerLink: 'approve-accounts',
    src: 'images/svg/settings/approve-accounts.svg',
    alt: 'approve accounts icon',
    translateString: 'settings.sections.approve-accounts'
  },
  {
    routerLink: 'approve-cards',
    src: 'images/svg/settings/accounts.svg',
    alt: 'approve cards icon',
    translateString: 'settings.sections.approve-cards'
  },
  {
    routerLink: 'loan-management',
    src: 'images/svg/settings/loan-management.svg',
    alt: 'loan management icon',
    translateString: 'settings.sections.loan-management'
  }
] as const;