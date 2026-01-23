import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiDrawer } from '../../../../../../../../shared/lib/overlay/ui-drawer/ui-drawer';
import { TextInput } from '../../../../../../../../shared/lib/forms/input-field/text-input';
import { emailConfig, nameConfig } from './config/inputs.config';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-drawer-modal',
  imports: [UiDrawer, TextInput, LibraryTitle, ButtonComponent],
  templateUrl: './drawer-modal.html',
  styleUrl: './drawer-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerModal {
  public isOpen = signal<boolean>(false);
  public readonly nameConfig = nameConfig;
  public readonly emailConfig = emailConfig;
  public readonly drawerTitle: string = 'Drawer Title';
  public readonly drawerSubtitle: string =
    'This is a drawer component optimized for mobile.';

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }

  public onSubmit(): void {
    this.toggle();
  }
}
