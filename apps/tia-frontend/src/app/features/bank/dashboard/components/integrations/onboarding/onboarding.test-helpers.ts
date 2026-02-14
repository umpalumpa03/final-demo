import { signal } from '@angular/core';
import { vi } from 'vitest';
import { OnboardingStep } from '../../onboarding/shared/models/onboarding.model';
import { ONBOARDING_STEPS } from '../../onboarding/shared/config/onboarding.config';

export const mockOnboardingSteps: OnboardingStep[] = ONBOARDING_STEPS;

export function createMockBreakpointService(isMobile = false) {
  return {
    isMobile: signal(isMobile),
    isTablet: signal(false),
    isXsMobile: signal(false),
    isExtraSmall: signal(false),
  };
}

export function createMockStore(hasCompletedOnboarding = false) {
  return {
    dispatch: vi.fn(),
    selectSignal: vi.fn().mockReturnValue(signal(hasCompletedOnboarding)),
  };
}

export function createMockModalResponsiveService() {
  return {
    cardStyle: signal(null),
    spotlightStyle: signal(null),
    isFallback: signal(false),
    startTracking: vi.fn(),
    stopTracking: vi.fn(),
  };
}
