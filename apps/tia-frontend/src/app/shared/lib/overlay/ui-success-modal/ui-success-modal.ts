import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { UiModal } from '../ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-success-modal',
  imports: [UiModal, ButtonComponent],
  templateUrl: './ui-success-modal.html',
  styleUrl: './ui-success-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessModal {
  public readonly isOpen = input.required<boolean>();
  public readonly title = input<string>('Success!');
  public readonly description = input<string>('Your action was completed.');
  public readonly buttonText = input<string>('Done');

  public readonly closed = output<void>();
  public readonly done = output<void>();
}
