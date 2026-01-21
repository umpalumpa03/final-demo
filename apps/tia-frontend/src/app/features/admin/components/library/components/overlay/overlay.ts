import { Component, signal } from '@angular/core';
import { UiModal } from 'apps/tia-frontend/src/app/shared/lib/layout/ui-modal';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [UiModal],
  templateUrl: './overlay.html',
  styleUrls: ['./overlay.scss'],
})
export class Overlay {
  public isDialogOpen = signal<boolean>(false);
  public isFormDialogOpen = signal<boolean>(false);
  public isLargeDialogOpen = signal<boolean>(false);

  public isDeleteAlertOpen = signal<boolean>(false);
  public isConfirmAlertOpen = signal<boolean>(false);

  public isRightSheetOpen = signal<boolean>(false);
  public isLeftSheetOpen = signal<boolean>(false);
  public isTopSheetOpen = signal<boolean>(false);
  public isBottomSheetOpen = signal<boolean>(false);

  public isDrawerOpen = signal<boolean>(false);

  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }
}
