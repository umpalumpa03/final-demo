import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-onboarding-modal',
  imports: [UiModal, ButtonComponent],
  templateUrl: './onboarding-modal.html',
  styleUrl: './onboarding-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingModal {
  public readonly page = input.required<number>();

  public readonly title = input.required<string>();
  public readonly desc = input.required<string>();

  public readonly next = output<void>();
  public readonly prev = output<void>();
  public readonly skip = output<void>();
}
