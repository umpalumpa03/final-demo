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
    title: 'New Feature Available',
    message: '',
  },
  success: {
    type: 'success' as const,
    title: 'Profile Updated',
    message: '',
  },
  error: {
    id: 1,
    type: 'warning' as const,
    title: 'Error',
    message: '',
  },
};

export const AUTH_SIDE_PANEL_DATA = {
  signIn: {
    title: 'Welcome Back!',
    description: 'Secure and easy access to your financial dashboard',
    features: [
      {
        id: 1,
        title: 'Secure Authentication',
        text: 'Multi-factor authentication and advanced security measures protect your account',
        icon: 'images/svg/auth/security.svg',
      },
      {
        id: 2,
        title: 'Quick Access',
        text: 'Fast login process with biometric options for seamless user experience',
        icon: 'images/svg/auth/speed.svg',
      },
      {
        id: 3,
        title: '24/7 Support',
        text: 'Round-the-clock customer support to help you with any questions',
        icon: 'images/svg/auth/support.svg',
      },
    ] as IFeaturePanel[],
  },
  signUp: {
    title: 'Join TIA Today!',
    description: 'Create your account and start managing your finances with ease',
    features: [
      {
        id: 1,
        title: 'Easy Registration',
        text: 'Simple sign-up process with email verification for account security',
        icon: 'images/svg/auth/register.svg',
      },
      {
        id: 2,
        title: 'Financial Tools',
        text: 'Access powerful financial management tools and insights',
        icon: 'images/svg/auth/tools.svg',
      },
      {
        id: 3,
        title: 'Mobile Banking',
        text: 'Manage your finances on-the-go with our mobile app',
        icon: 'images/svg/auth/mobile.svg',
      },
    ] as IFeaturePanel[],
  },
  forgotPassword: {
    title: 'Password Recovery',
    description: 'Securely reset your password and regain access to your account',
    features: [
      {
        id: 1,
        title: 'Secure Reset',
        text: 'OTP verification ensures only you can reset your password',
        icon: 'images/svg/auth/reset.svg',
      },
      {
        id: 2,
        title: 'Account Protection',
        text: 'Advanced security measures keep your account safe during recovery',
        icon: 'images/svg/auth/protect.svg',
      },
      {
        id: 3,
        title: 'Quick Recovery',
        text: 'Get back to your account in minutes with our streamlined process',
        icon: 'images/svg/auth/quick.svg',
      },
    ] as IFeaturePanel[],
  },
  otpSignIn: {
    title: 'Verify Your Identity',
    description: 'Complete your login with the verification code sent to your device',
    features: [
      {
        id: 1,
        title: 'Two-Factor Security',
        text: 'Additional layer of security with SMS verification',
        icon: 'images/svg/auth/2fa.svg',
      },
      {
        id: 2,
        title: 'Instant Verification',
        text: 'Quick code entry for immediate account access',
        icon: 'images/svg/auth/instant.svg',
      },
      {
        id: 3,
        title: 'Secure Session',
        text: 'Verified sessions protect your financial data',
        icon: 'images/svg/auth/session.svg',
      },
    ] as IFeaturePanel[],
  },
  otpSignUp: {
    title: 'Verify Your Phone',
    description: 'Confirm your phone number to complete the registration process',
    features: [
      {
        id: 1,
        title: 'Phone Verification',
        text: 'Secure phone number verification for account protection',
        icon: 'images/svg/auth/phone-verify.svg',
      },
      {
        id: 2,
        title: 'Account Security',
        text: 'Verified contact information enhances your account security',
        icon: 'images/svg/auth/account-secure.svg',
      },
      {
        id: 3,
        title: 'Contact Verification',
        text: 'Ensure we can reach you for important account updates',
        icon: 'images/svg/auth/contact.svg',
      },
    ] as IFeaturePanel[],
  },
  otpForgotPassword: {
    title: 'Reset Password',
    description: 'Enter the verification code to securely reset your password',
    features: [
      {
        id: 1,
        title: 'Password Reset',
        text: 'Secure password reset with OTP verification',
        icon: 'images/svg/auth/password-reset.svg',
      },
      {
        id: 2,
        title: 'Account Recovery',
        text: 'Regain access to your account safely and quickly',
        icon: 'images/svg/auth/recovery.svg',
      },
      {
        id: 3,
        title: 'Security First',
        text: 'Your account security is our top priority during recovery',
        icon: 'images/svg/auth/security-first.svg',
      },
    ] as IFeaturePanel[],
  },
  signUpSuccess: {
    title: 'Welcome to TIA!',
    description: 'Your account has been successfully created. Start exploring your financial dashboard.',
    features: [
      {
        id: 1,
        title: 'Account Created',
        text: 'Your TIA banking account is now active and ready to use',
        icon: 'images/svg/auth/account-created.svg',
      },
      {
        id: 2,
        title: 'Explore Features',
        text: 'Discover powerful banking tools and financial insights',
        icon: 'images/svg/auth/explore.svg',
      },
      {
        id: 3,
        title: 'Get Started',
        text: 'Begin managing your finances with our intuitive dashboard',
        icon: 'images/svg/auth/get-started.svg',
      },
    ] as IFeaturePanel[],
  },
  forgotPasswordSuccess: {
    title: 'Password Updated!',
    description: 'Your password has been successfully reset. You can now log in with your new password.',
    features: [
      {
        id: 1,
        title: 'Password Changed',
        text: 'Your account password has been securely updated',
        icon: 'images/svg/auth/password-changed.svg',
      },
      {
        id: 2,
        title: 'Secure Login',
        text: 'Log in with your new password and enjoy secure access',
        icon: 'images/svg/auth/secure-login.svg',
      },
      {
        id: 3,
        title: 'Account Protection',
        text: 'Your account remains protected with updated credentials',
        icon: 'images/svg/auth/protection.svg',
      },
    ] as IFeaturePanel[],
  },
  phone: {
    title: 'Phone Verification',
    description: 'Add your phone number for enhanced security and account recovery',
    features: [
      {
        id: 1,
        title: 'Phone Security',
        text: 'Phone number verification adds an extra layer of security',
        icon: 'images/svg/auth/phone-security.svg',
      },
      {
        id: 2,
        title: 'Account Recovery',
        text: 'Use your phone for password reset and account recovery',
        icon: 'images/svg/auth/account-recovery.svg',
      },
      {
        id: 3,
        title: 'Contact Updates',
        text: 'Stay connected with important account notifications',
        icon: 'images/svg/auth/contact-updates.svg',
      },
    ] as IFeaturePanel[],
  },
} as const;


