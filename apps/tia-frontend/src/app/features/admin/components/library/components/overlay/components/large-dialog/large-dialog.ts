import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-large-dialog',
  imports: [UiModal],
  templateUrl: './large-dialog.html',
  styleUrl: './large-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LargeDialog {
  public isOpen = signal(false);
  public toggle() {
    this.isOpen.update((v) => !v);
  }
}
