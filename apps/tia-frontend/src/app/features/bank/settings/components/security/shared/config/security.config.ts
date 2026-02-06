export const SECURITY_FORM_CONFIG = {
  currentPassword: {
    labelKey: 'settings.security.currentPassword',
    placeholderKey: 'settings.security.currentPasswordPlaceholder',
    required: true,
  },
  newPassword: {
    labelKey: 'settings.security.newPassword',
    placeholderKey: 'settings.security.newPasswordPlaceholder',
    required: true,
  },
  confirmPassword: {
    labelKey: 'settings.security.confirmNewPassword',
    placeholderKey: 'settings.security.confirmNewPasswordPlaceholder',
    required: true,
  },
} as const;
