export const ERROR_STATE = {
  maxWidth: '86rem',
  error: {
    message: 'settings.accounts.errorMessage',
    button: 'settings.accounts.errorBtn',
  },
  warning: {
    variant: 'not-found',
    header: 'settings.accounts.warningHeader',
    message: 'settings.accounts.warningMessage',
    button: 'settings.accounts.warningBtn',
  },
} as const;

export const ACCOUNT_ACTIONS = {
  basic: {
    maxWidth: '100%',
    minHeight: '11.4rem',
    padding: '1.8rem',
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: '0',
    flexDirection: 'row',
    mobilePadding: '1.2rem',
  },
  nameBtn: {
    variant: 'outline',
    size: 'small',
    iconWidth: '1.4rem',
    iconHeight: '1.4rem',
    icon: 'edit.svg',
  },
  favorite: {
    variantActive: 'default',
    variantInactive: 'outline',
    size: 'small',
    iconWidth: '1.4rem',
    iconHeight: '1.4rem',
    icons: {
      active: 'favorited.svg',
      inactive: 'non-favorite.svg',
    },
    customColor: '#F0B100',
    labels: {
      active: 'settings.accounts.favoritedButton',
      inactive: 'settings.accounts.favoriteButton',
    },
  },
  visibility: {
    variant: 'outline',
    size: 'small',
    iconWidth: '1.4rem',
    iconHeight: '1.4rem',
    icons: {
      hidden: 'eye.svg',
      visible: 'eye-hide.svg',
    },
    labels: {
      hidden: 'settings.accounts.showButton',
      visible: 'settings.accounts.hideButton',
    },
  },
  modal: {
    cancel: {
      variant: 'outline',
      label: 'settings.accounts.cancel',
    },
    save: {
      variant: 'default',
      icon: 'white-confirm-icon.svg',
      iconWidth: '1.2rem',
      label: 'settings.accounts.saveChanges',
    },
  },
} as const;
