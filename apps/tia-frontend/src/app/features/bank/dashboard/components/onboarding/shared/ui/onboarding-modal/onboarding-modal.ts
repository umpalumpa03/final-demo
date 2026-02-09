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
  private readonly OFFSET_THRESHOLD = 2;

  public readonly page = input.required<number>();
  public readonly title = input.required<string>();
  public readonly desc = input.required<string>();
  public readonly target = input<OnboardingTarget | null>(null);

  public readonly offset = computed(() =>
    this.page() > this.OFFSET_THRESHOLD ? { left: -300 } : { left: 0 },
  );

  public readonly showPrevButton = computed(() => this.page() >= 2);
  public readonly nextButtonLabel = computed(() =>
    this.page() === this.LAST_PAGE ? 'Finish >' : 'Next >',
  );
  public readonly placement = computed(() =>
    this.page() === 2 ? 'right' : 'bottom',
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
