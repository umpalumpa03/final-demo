import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiSheetModal } from '../../../../../../../../shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';
import { navItems } from './configs/item.config';

@Component({
  selector: 'app-left-sheet-demo',
  imports: [UiSheetModal],
  templateUrl: './left-sheet-demo.html',
  styleUrl: './left-sheet-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftSheetDemo {
  public isOpen = signal<boolean>(false);
  public libraryNavItems = signal(navItems);

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
