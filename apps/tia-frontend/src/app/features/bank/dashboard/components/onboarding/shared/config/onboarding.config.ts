import { OnboardingStep } from '../models/onboarding.model';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'dashboard.onboarding.steps.welcome.title',
    desc: 'dashboard.onboarding.steps.welcome.desc',
  },
  {
    title: 'dashboard.onboarding.steps.navigation.title',
    desc: 'dashboard.onboarding.steps.navigation.desc',
  },
  {
    title: 'dashboard.onboarding.steps.messages.title',
    desc: 'dashboard.onboarding.steps.messages.desc',
  },
  {
    title: 'dashboard.onboarding.steps.notifications.title',
    desc: 'dashboard.onboarding.steps.notifications.desc',
  },
  {
    title: 'dashboard.onboarding.steps.widgets.title',
    desc: 'dashboard.onboarding.steps.widgets.desc',
  },
  {
    title: 'dashboard.onboarding.steps.finish.title',
    desc: 'dashboard.onboarding.steps.finish.desc',
  },
] as const;
