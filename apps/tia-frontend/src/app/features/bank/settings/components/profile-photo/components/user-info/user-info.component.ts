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

@Component({
  selector: 'app-user-info',
  imports: [
    BasicCard,
    ButtonComponent,
    TranslatePipe,
    TextInput,
    FormsModule,
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
  public readonly isEditingPId = input<boolean>(false);
  public readonly isPersonalNumberUnchanged = input<boolean>(false);


  public readonly updatePersonalNumber = output<string | null>();
  public readonly editPersonalNumber = output<void>();
  public readonly personalNumberChange = output<string | number | boolean | FileList | null>();
  public readonly cancelEditPersonalNumber = output<void>();

  public onPersonalNumberChange(value: string | number | boolean | FileList | null): void {
    this.personalNumberChange.emit(value);
  }

  public onEditPersonalNumber(): void {
    this.editPersonalNumber.emit();
  }

  public onCancelEdit(): void {
    this.cancelEditPersonalNumber.emit();
  }

  public onSavePersonalNumber(): void {
    this.updatePersonalNumber.emit(this.editedPId() || null);
  }
}
