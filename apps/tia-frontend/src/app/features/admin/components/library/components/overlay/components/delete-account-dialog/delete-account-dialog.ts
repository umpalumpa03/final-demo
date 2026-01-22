import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-delete-account-dialog',
  imports: [UiModal],
  templateUrl: './delete-account-dialog.html',
  styleUrl: './delete-account-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountDialog {
  public isOpen = signal<boolean>(false);

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
