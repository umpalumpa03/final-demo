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
    title: 'Welcome Back!',
    description: 'Sign in to continue to your account and access all features.',
    features: [
      {
        id: 1,
        title: 'Secure Authentication',
        text: 'Two-factor verification for enhanced security',
        icon: '/images/svg/auth/setup.svg',
      },
      {
        id: 2,
        title: 'Protected Data',
        text: 'Your information is encrypted and safe',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 3,
        title: 'Protected Data',
        text: 'Your information is encrypted and safe',
        icon: '/images/svg/auth/secured.svg',
      },
    ] as IFeaturePanel[],
  },
  signUp: {
    title: 'Join Us Today!',
    description: 'Create your account and start your journey with us.',
    features: [
      {
        id: 1,
        title: 'Quick Setup',
        text: 'Get started in just a few minutes',
        icon: '/images/svg/auth/setup.svg',
      },
      {
        id: 2,
        title: 'Secure & Private',
        text: 'Your data is protected with encryption',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 3,
        title: 'Email Verification',
        text: 'Verify your account via email',
        icon: '/images/svg/auth/email.svg',
      },
    ] as IFeaturePanel[],
  },
  forgotPassword: {
    title: 'Reset Your Password!',
    description: 'Enter your email to receive a password reset code.',
    features: [
      {
        id: 1,
        title: 'Email Verification',
        text: 'Code sent to your registered email',
        icon: '/images/svg/auth/email.svg',
      },
    ] as IFeaturePanel[],
  },
  otpSignIn: {
    title: 'Almost There!',
    description: 'Enter the verification code to complete your sign in.',
    features: [
      {
        id: 1,
        title: 'Two-Factor Security',
        text: 'Extra layer of protection for your account',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 2,
        title: 'Check Your Email',
        text: 'Code sent to your registered email',
        icon: '/images/svg/auth/setup.svg',
      },
    ] as IFeaturePanel[],
  },
  otpSignUp: {
    title: 'Almost Done!',
    description: 'Enter the code to complete your registration.',
    features: [
      {
        id: 1,
        title: 'Phone Verification',
        text: 'Secure Verification',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 2,
        title: 'Final Step',
        text: 'You are almost ready to get started',
        icon: '/images/svg/auth/secured.svg',
      },
    ] as IFeaturePanel[],
  },
  otpForgotPassword: {
    title: 'Almost There!',
    description: 'Enter the verification code to complete your sign in.',
    features: [
      {
        id: 1,
        title: 'Two-Factor Security',
        text: 'Extra layer of protection for your account',
        icon: '/images/svg/auth/secured.svg',
      },
      {
        id: 2,
        title: 'Check Your Email',
        text: 'Code sent to your registered email',
        icon: '/images/svg/auth/email.svg',
      },
    ] as IFeaturePanel[],
  },
  phone: {
    title: 'Verify Your Identity',
    description: 'Add your phone number to secure your account.',
    features: [
      {
        id: 1,
        title: 'SMS Verification',
        text: 'Receive a code via text message',
        icon: '/images/svg/auth/phone.svg',
      },
      {
        id: 2,
        title: 'Account Security',
        text: 'Extra protection for your account',
        icon: '/images/svg/auth/secured.svg',
      },
    ] as IFeaturePanel[],
  },
} as const;
