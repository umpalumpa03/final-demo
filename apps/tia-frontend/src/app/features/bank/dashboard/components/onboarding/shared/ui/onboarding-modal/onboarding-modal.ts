import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { OnboardingTarget } from '../../models/onboarding.model';
import { ModalOffset } from '@tia/shared/lib/overlay/ui-modal/models/modal-positions.model';
import { NgTemplateOutlet } from '@angular/common';
import { ModalResponsiveService } from '@tia/shared/lib/overlay/ui-modal/services/service-modal';

@Component({
  selector: 'app-onboarding-modal',
  imports: [UiModal, ButtonComponent, NgTemplateOutlet],
  templateUrl: './onboarding-modal.html',
  styleUrl: './onboarding-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingModal {
  private readonly modalService = inject(ModalResponsiveService);
  private readonly LAST_PAGE = 6;

  public readonly page = input.required<number>();
  public readonly title = input.required<string>();
  public readonly desc = input.required<string>();
  public readonly target = input<OnboardingTarget | null>(null);

  private readonly PAGE_OFFSETS: Record<number, ModalOffset> = {
    1: {},
    2: { top: 100 },
    3: { left: -300 },
    4: { left: -300 },
    5: { left: -300 },
    6: {},
  };

  private readonly MOBILE_PAGE_OFFSETS: Record<number, ModalOffset> = {
    2: { left: 250 },
  };

  public readonly offset = computed(() => {
    const isMobile = this.target() === 'onboard-sidebar-mobile';
    if (isMobile && this.MOBILE_PAGE_OFFSETS[this.page()]) {
      return this.MOBILE_PAGE_OFFSETS[this.page()];
    }
    return this.PAGE_OFFSETS[this.page()] ?? {};
  });

  public readonly showPrevButton = computed(() => this.page() >= 2);
  public readonly nextButtonLabel = computed(() =>
    this.page() === this.LAST_PAGE ? 'Finish >' : 'Next >',
  );
  public readonly placement = computed(() =>
    this.target() === 'onboard-sidebar' ? 'right' : 'bottom',
  );

  public readonly next = output<void>();
  public readonly prev = output<void>();
  public readonly skip = output<void>();

  constructor() {
    effect(() => {
      if (!this.target()) {
        this.resetModalStyles();
      }
    });
  }

  private resetModalStyles(): void {
    this.modalService.cardStyle.set(null);
    this.modalService.spotlightStyle.set(null);
  }
}
