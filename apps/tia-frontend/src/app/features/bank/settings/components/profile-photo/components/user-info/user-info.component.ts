import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe } from '@ngx-translate/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { FormsModule } from '@angular/forms';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';

@Component({
  selector: 'app-user-info',
  imports: [
    BasicCard,
    ButtonComponent,
    TranslatePipe,
    TextInput,
    FormsModule,
    Tooltip,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {

  public readonly pId = input<string | null>(null);
  public readonly phoneNumber = input<string | null>(null);
  public readonly personalInfoLoading = input<boolean>(false);
  public readonly personalInfoUpdated = input<boolean>(false);
  public readonly personalInfoError = input<string | null>(null);
  public readonly editedPId = input<string>('');
  public readonly isEditing = input<boolean>(false);
  public readonly isPersonalNumberUnchanged = input<boolean>(false);
  public readonly editedPhoneNumber = input<string>('');
  public readonly isPhoneNumberUnchanged = input<boolean>(false);
  public readonly phoneUpdateLoading = input<boolean>(false);
  public readonly saveDisabledReason = input<string | null>(null);

  public readonly updatePersonalNumber = output<string | null>();
  public readonly edit = output<void>();
  public readonly personalNumberChange = output<string | number | boolean | FileList | null>();
  public readonly cancelEdit = output<void>();
  public readonly updatePhoneNumber = output<string | null>();
  public readonly phoneNumberChange = output<string | number | boolean | FileList | null>();
  public readonly save = output<void>();
  public readonly startTour = output<void>();

  public onPersonalNumberChange(value: string | number | boolean | FileList | null): void {
    this.personalNumberChange.emit(value);
  }

  public onEdit(): void {
    this.edit.emit();
  }

  public onCancelEdit(): void {
    this.cancelEdit.emit();
  }

  public onSave(): void {
    this.save.emit();
  }

  public onPhoneNumberChange(value: string | number | boolean | FileList | null): void {
    this.phoneNumberChange.emit(value);
  }

  public onStartTour(): void {
    this.startTour.emit();
  }
}
