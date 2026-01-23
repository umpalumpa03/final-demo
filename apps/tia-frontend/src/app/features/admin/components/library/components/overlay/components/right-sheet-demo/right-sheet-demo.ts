import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiSheetModal } from '../../../../../../../../shared/lib/overlay/ui-sheet-modal/ui-sheet-modal';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import {
  modalBioInput,
  modalUsernameInput,
} from '../edit-profile-dialog/config/inputs.config';

@Component({
  selector: 'app-right-sheet-demo',
  imports: [UiSheetModal, LibraryTitle, ButtonComponent, TextInput, Textarea],
  templateUrl: './right-sheet-demo.html',
  styleUrl: './right-sheet-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightSheetDemo {
  public isOpen = signal<boolean>(false);

  public readonly sheetTitle: string = 'Edit Settings';
  public readonly sheetSubtitle: string = 'Make changes to your settings here.';

  public readonly usernameInput = modalUsernameInput;
  public readonly bioInput = modalBioInput;

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
