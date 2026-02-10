export interface OnboardingStep {
  title: string;
  desc: string;
}

export type OnboardingTarget =
  | 'onboard-sidebar'
  | 'onboard-messaging'
  | 'onboard-notifications'
  | null;
