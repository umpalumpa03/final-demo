import { Component, signal } from '@angular/core';
import { UiSheetModal } from '../../../../../../../../shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';

@Component({
  selector: 'app-right-sheet-demo',
  imports: [UiSheetModal],
  templateUrl: './right-sheet-demo.html',
  styleUrl: './right-sheet-demo.scss',
})
export class RightSheetDemo {
  public isOpen = signal<boolean>(false);

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
