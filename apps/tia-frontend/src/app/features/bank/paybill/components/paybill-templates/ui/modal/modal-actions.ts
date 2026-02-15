import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';

@Component({
  selector: 'app-modal-actions',
  imports: [TranslatePipe, ButtonComponent],
  templateUrl: './modal-actions.html',
  styleUrl: './modal-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalActions {
  public submitVariant = input<ButtonVariant>('default');
  public submitLabel = input.required<string>();
  public submitType = input<'button' | 'submit' | 'reset'>('submit');
  public isLoading = input<boolean>(false);
  public cancel = output<void>();
  public submit = output<void>();
  public isDisabled = input<boolean>(false);

  public submitHandler(): void {
    if (this.isDisabled()) {
      return;
    }

    this.submit.emit();
  }

  public cancelHandler(): void {
    if (this.isLoading()) {
      return;
    }

    this.cancel.emit();
  }
}
