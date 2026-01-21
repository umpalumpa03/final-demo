import { Component, signal } from '@angular/core';
import { UiModal } from '../../../../../../../../shared/lib/layout/ui-modal';

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [UiModal],
  templateUrl: './edit-profile-dialog.html',
  styleUrl: './edit-profile-dialog.scss',
})
export class EditProfileDialog {
  public isOpen = signal<boolean>(false);
  public toggle() {
    this.isOpen.update((v) => !v);
  }
}
