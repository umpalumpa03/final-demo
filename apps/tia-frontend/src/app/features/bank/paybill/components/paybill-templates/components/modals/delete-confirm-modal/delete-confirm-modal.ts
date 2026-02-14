import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ModalActions } from '../../../ui/modal/modal-actions';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';

@Component({
  selector: 'app-delete-confirm-modal',
  imports: [TranslatePipe, ModalActions],
  templateUrl: './delete-confirm-modal.html',
  styleUrl: './delete-confirm-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmModal {
  public itemIdentifier = input.required<string>();
  public description = input<string>();
  public submitVariant = input.required<ButtonVariant>();
  public submitLabel = input.required<string>();
  public isLoading = input<boolean>(false);

  public cancel = output<void>();
  public submit = output<void>();
}
