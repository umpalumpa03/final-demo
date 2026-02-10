import {
  Component,
  inject,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectOnboardingStatus } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { OnboardingModal } from './shared/ui/onboarding-modal/onboarding-modal';
import { NavigationHub } from './shared/ui/navigation-hub/navigation-hub';
import { CustomizableWidgets } from './shared/ui/customizable-widgets/customizable-widgets';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import { ONBOARDING_STEPS } from './shared/config/onboarding.config';
import { OnboardingTarget } from './shared/models/onboarding.model';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';

@Component({
  selector: 'app-onboarding',
  imports: [OnboardingModal, NavigationHub, CustomizableWidgets],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Onboarding {
  private readonly store = inject(Store);
  private readonly breakpoint = inject(BreakpointService);
  public readonly close = output<void>();

  public readonly target = computed<OnboardingTarget>(() => {
    const sidebarTarget = this.breakpoint.isMobile()
      ? 'onboard-sidebar-mobile'
      : 'onboard-sidebar';

    const targets: Record<number, OnboardingTarget> = {
      2: sidebarTarget,
      3: 'onboard-messaging',
      4: 'onboard-notifications',
    };

    return targets[this.currentPage()];
  });

  public hasCompletedOnboarding = this.store.selectSignal(
    selectOnboardingStatus,
  );

  private readonly steps = ONBOARDING_STEPS;

  public currentPage = signal(1);
  public isDismissed = signal(false);

  public isModalOpen = computed(() => {
    return !this.hasCompletedOnboarding() && !this.isDismissed();
  });

  public currentStepData = computed(() => {
    const index = this.currentPage() - 1;
    return this.steps[index] || this.steps[0];
  });

  public onNext(): void {
    if (this.currentPage() < 6) {
      this.currentPage.update((v) => v + 1);
    } else {
      this.finishOnboarding();
    }
  }

  public onPrev(): void {
    this.currentPage.update((v) => v - 1);
  }

  public finishOnboarding(): void {
    this.isDismissed.set(true);
    this.store.dispatch(
      UserInfoActions.updateOnboardingStatus({ completed: true }),
    );
    this.close.emit();
  }
}
