import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { LibraryTitle } from "../../../../shared/library-title/library-title";
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-delete-account-dialog',
  imports: [UiModal, LibraryTitle, ButtonComponent],
  templateUrl: './delete-account-dialog.html',
  styleUrl: './delete-account-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountDialog {
  public isOpen = signal<boolean>(false);

  public readonly dialogTitle = 'Are you absolutely sure?';
  public readonly dialogSubtitle =
    'This action cannot be undone. This will permanently delete your account and remove your data from our servers.';

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
