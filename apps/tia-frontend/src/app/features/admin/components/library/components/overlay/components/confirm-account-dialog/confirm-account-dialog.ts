import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";
import { LibraryTitle } from "../../../../shared/library-title/library-title";

@Component({
  selector: 'app-confirm-account-dialog',
  imports: [UiModal, ButtonComponent, LibraryTitle],
  templateUrl: './confirm-account-dialog.html',
  styleUrl: './confirm-account-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmAccountDialog {
  public isOpen = signal<boolean>(false);

  public readonly confirmTitle = 'Confirm your action';
  public readonly confirmSubtitle =
    'Are you sure you want to proceed with this action?';

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
