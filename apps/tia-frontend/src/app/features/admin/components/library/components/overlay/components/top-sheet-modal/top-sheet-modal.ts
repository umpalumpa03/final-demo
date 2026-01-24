import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiSheetModal } from '../../../../../../../../shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-top-sheet-modal',
  imports: [UiSheetModal, LibraryTitle, ButtonComponent],
  templateUrl: './top-sheet-modal.html',
  styleUrl: './top-sheet-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopSheetModal {
  public modalTitle = 'Notification Banner';
  public modalSubtitle = 'Important announcements and update=s';
  public isOpen = signal<boolean>(false);

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
