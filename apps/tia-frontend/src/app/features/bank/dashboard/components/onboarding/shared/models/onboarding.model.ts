export interface OnboardingStep {
  title: string;
  desc: string;
}

export type OnboardingTarget =
  | 'onboard-sidebar'
  | 'onboard-sidebar-mobile'
  | 'onboard-messaging'
  | 'onboard-notifications'
  | null;
