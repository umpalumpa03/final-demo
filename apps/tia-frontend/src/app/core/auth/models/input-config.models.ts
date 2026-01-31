import { IFeaturePanel } from './auth.models';

export const SIGN_IN_FORM = {
  username: {
    label: 'Username',
    placeholder: 'Enter password',
  },
  password: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
} as const;

export const ALERTS_DISMISSIBLE_DATA = {
  info: {
    type: 'information' as const,
    title: 'New Feature Available' as const,
    message: '',
  },
  success: {
    type: 'success' as const,
    title: 'Profile Updated' as const,
    message: '',
  },
  error: {
    id: 1,
    type: 'warning' as const,
    title: 'Error' as const,
    message: '',
  },
};

export const AUTH_SIDE_PANEL_DATA = {
  signIn: {
    title: 'auth.sign-in.side-panel.title',
    description: 'auth.sign-in.side-panel.description',
    features: [
      {
        id: 1,
        title: 'auth.sign-in.side-panel.features.secure-auth.title',
        text: 'auth.sign-in.side-panel.features.secure-auth.text',
        icon: '/images/svg/auth/setup.svg',
      },
      {
        id: 2,
        title: 'auth.sign-in.side-panel.features.protected-data.title',
        text: 'auth.sign-in.side-panel.features.protected-data.text',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 3,
        title: 'auth.sign-in.side-panel.features.protected-data-2.title',
        text: 'auth.sign-in.side-panel.features.protected-data-2.text',
        icon: '/images/svg/auth/secured.svg',
      }
    ],
  },

  signUp: {
    title: 'auth.sign-up.side-panel.title',
    description: 'auth.sign-up.side-panel.description',
    features: [
      {
        id: 1,
        title: 'auth.sign-up.side-panel.features.quick-setup.title',
        text: 'auth.sign-up.side-panel.features.quick-setup.text',
        icon: '/images/svg/auth/setup.svg',
      },
      {
        id: 2,
        title: 'auth.sign-up.side-panel.features.secure-private.title',
        text: 'auth.sign-up.side-panel.features.secure-private.text',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 3,
        title: 'auth.sign-up.side-panel.features.email-verification.title',
        text: 'auth.sign-up.side-panel.features.email-verification.text',
        icon: '/images/svg/auth/email.svg',
      }
    ],
  },

  forgotPassword: {
    title: 'auth.forgot-password.side-panel.title',
    description: 'auth.forgot-password.side-panel.description',
    features: [
      {
        id: 1,
        title: 'auth.forgot-password.side-panel.features.email-verification.title',
        text: 'auth.forgot-password.side-panel.features.email-verification.text',
        icon: '/images/svg/auth/email.svg',
      }
    ],
  },

  otpSignIn: {
    title: 'auth.otp-sign-in.side-panel.title',
    description: 'auth.otp-sign-in.side-panel.description',
    features: [
      {
        id: 1,
        title: 'auth.otp-sign-in.side-panel.features.two-factor.title',
        text: 'auth.otp-sign-in.side-panel.features.two-factor.text',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 2,
        title: 'auth.otp-sign-in.side-panel.features.check-email.title',
        text: 'auth.otp-sign-in.side-panel.features.check-email.text',
        icon: '/images/svg/auth/setup.svg',
      }
    ],
  },

  otpSignUp: {
    title: 'auth.otp-sign-up.side-panel.title',
    description: 'auth.otp-sign-up.side-panel.description',
    features: [
      {
        id: 1,
        title: 'auth.otp-sign-up.side-panel.features.phone-verification.title',
        text: 'auth.otp-sign-up.side-panel.features.phone-verification.text',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 2,
        title: 'auth.otp-sign-up.side-panel.features.final-step.title',
        text: 'auth.otp-sign-up.side-panel.features.final-step.text',
        icon: '/images/svg/auth/secured.svg',
      }
    ],
  },

  otpForgotPassword: {
    title: 'auth.otp-forgot-password.side-panel.title',
    description: 'auth.otp-forgot-password.side-panel.description',
    features: [
      {
        id: 1,
        title: 'auth.otp-forgot-password.side-panel.features.two-factor.title',
        text: 'auth.otp-forgot-password.side-panel.features.two-factor.text',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 2,
        title: 'auth.otp-forgot-password.side-panel.features.check-email.title',
        text: 'auth.otp-forgot-password.side-panel.features.check-email.text',
        icon: '/images/svg/auth/email.svg',
      }
    ],
  },

  phone: {
    title: 'auth.phone.side-panel.title',
    description: 'auth.phone.side-panel.description',
    features: [
      {
        id: 1,
        title: 'auth.phone.side-panel.features.sms-verification.title',
        text: 'auth.phone.side-panel.features.sms-verification.text',
        icon: '/images/svg/auth/phone.svg',
      },
      {
        id: 2,
        title: 'auth.phone.side-panel.features.account-security.title',
        text: 'auth.phone.side-panel.features.account-security.text',
        icon: '/images/svg/auth/secured.svg',
      }
    ],
  }
};
