import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-confirm-account-dialog',
  imports: [UiModal],
  templateUrl: './confirm-account-dialog.html',
  styleUrl: './confirm-account-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmAccountDialog {
  public isOpen = signal<boolean>(false);

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
