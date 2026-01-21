import { Component, signal } from '@angular/core';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-form-dialog',
  imports: [UiModal],
  templateUrl: './form-dialog.html',
  styleUrl: './form-dialog.scss',
})
export class FormDialog {
  public isOpen = signal(false);
  public toggle() {
    this.isOpen.update((v) => !v);
  }
}
