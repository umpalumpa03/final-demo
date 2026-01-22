import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiSheetModal } from '../../../../../../../../shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';
import { navItems } from './configs/item.config';
import { LibraryTitle } from '../../../../shared/library-title/library-title';

@Component({
  selector: 'app-left-sheet-demo',
  imports: [UiSheetModal, LibraryTitle],
  templateUrl: './left-sheet-demo.html',
  styleUrl: './left-sheet-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftSheetDemo {
  public isOpen = signal<boolean>(false);
  public libraryNavItems = signal(navItems);

  public readonly sheetTitle: string = 'Navigation';
  public readonly sheetSubtitle: string = 'Quick access to main sections';

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
