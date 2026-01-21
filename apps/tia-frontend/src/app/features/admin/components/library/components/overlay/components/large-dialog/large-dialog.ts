import { Component, signal } from '@angular/core';
import { UiModal } from 'apps/tia-frontend/src/app/shared/lib/layout/ui-modal';

@Component({
  selector: 'app-large-dialog',
  imports: [UiModal],
  templateUrl: './large-dialog.html',
  styleUrl: './large-dialog.scss',
})
export class LargeDialog {
  public isOpen = signal(false);
  public toggle() {
    this.isOpen.update((v) => !v);
  }
}
