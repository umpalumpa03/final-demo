import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiSheetModal } from '../../../../../../../../shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';
import { LibraryTitle } from "../../../../shared/library-title/library-title";

@Component({
  selector: 'app-right-sheet-demo',
  imports: [UiSheetModal, LibraryTitle],
  templateUrl: './right-sheet-demo.html',
  styleUrl: './right-sheet-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightSheetDemo {
  public isOpen = signal<boolean>(false);

  public readonly sheetTitle: string = 'Edit Settings';
  public readonly sheetSubtitle: string = 'Make changes to your settings here.';

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
