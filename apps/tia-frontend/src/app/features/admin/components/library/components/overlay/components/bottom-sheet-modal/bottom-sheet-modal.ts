import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { quickActions } from './config/navigation.config';
import { UiSheetModal } from '../../../../../../../../shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';
import { BottomActionCard } from './components/bottom-action-card/bottom-action-card';
import { LibraryTitle } from '../../../../shared/library-title/library-title';

@Component({
  selector: 'app-bottom-sheet-modal',
  imports: [UiSheetModal, BottomActionCard, LibraryTitle],
  templateUrl: './bottom-sheet-modal.html',
  styleUrl: './bottom-sheet-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetModal {
  public isOpen = signal<boolean>(false);
  public readonly navConfig = signal(quickActions);

  public readonly sheetTitle: string = 'Quick Actions';
  public readonly sheetSubtitle: string = 'Frequently used actions';

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
