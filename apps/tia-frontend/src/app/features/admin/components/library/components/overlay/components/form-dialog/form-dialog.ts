import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiModal } from '../../../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import {
  modalDescriptionInput,
  modalNameInput,
} from '../edit-profile-dialog/config/inputs.config';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';

@Component({
  selector: 'app-form-dialog',
  imports: [UiModal, ButtonComponent, LibraryTitle, TextInput, Textarea],
  templateUrl: './form-dialog.html',
  styleUrl: './form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDialog {
  public isOpen = signal(false);
  public readonly projectNameInput = modalNameInput;
  public readonly projectDescriptionInput = modalDescriptionInput;
  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
  public readonly projectTitle: string = 'Create New Project';
  public readonly projectSubtitle: string =
    'Enter the details for your new project.';
}
