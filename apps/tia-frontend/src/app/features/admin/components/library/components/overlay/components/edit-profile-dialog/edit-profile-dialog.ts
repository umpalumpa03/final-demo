import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import {
  modalEmailInput,
  modalNameInput,
} from './config/inputs.config';

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [UiModal, ButtonComponent, LibraryTitle, TextInput],
  templateUrl: './edit-profile-dialog.html',
  styleUrl: './edit-profile-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileDialog {
  public isOpen = signal<boolean>(false);
  public readonly profileTitle: string = 'Edit Profile';
  public readonly profileSubtitle: string =
    "Make changes to your profile here. Click save when you're done.";
  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
  public readonly nameInput = modalNameInput;
  public readonly emailInput = modalEmailInput;
}
