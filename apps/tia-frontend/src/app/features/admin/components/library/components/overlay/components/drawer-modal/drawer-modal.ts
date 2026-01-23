import { Component, signal } from '@angular/core';
import { UiDrawer } from '../../../../../../../../shared/lib/overlay/ui-drawer/ui-drawer';

@Component({
  selector: 'app-drawer-modal',
  imports: [UiDrawer],
  templateUrl: './drawer-modal.html',
  styleUrl: './drawer-modal.scss',
})
export class DrawerModal {
  public isOpen = signal<boolean>(false);

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }

  public onSubmit(): void {
    this.toggle();
  }
}
