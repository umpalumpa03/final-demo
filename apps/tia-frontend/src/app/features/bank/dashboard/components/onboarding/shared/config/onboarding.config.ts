import { OnboardingStep } from '../models/onboarding.model';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to Your Dashboard!',
    desc: "This is your financial command center. Let's take a quick tour to show you around all the amazing features available to you.",
  },
  {
    title: 'Navigation Hub',
    desc: 'Your complete navigation menu with access to all features:',
  },
  {
    title: 'Messages',
    desc: 'Stay connected with your banking messages. The red badge shows you have 12 unread messages waiting for your attention. Click to view, compose, and manage your inbox.',
  },
  {
    title: 'Notifications Center',
    desc: 'Keep track of all your account activities, security alerts, and important updates. Click here to view, manage, and delete notifications. The red dot indicates unread notifications.',
  },
  {
    title: 'Your Customizable Widgets',
    desc: 'Personalize your dashboard with three powerful widgets that provide real-time financial insights:',
  },
  {
    title: "You're All Set!",
    desc: 'You now know how to navigate and use your dashboard effectively. You can restart this tour anytime by clicking the help button in the top right. Happy banking!',
  },
] as const;
