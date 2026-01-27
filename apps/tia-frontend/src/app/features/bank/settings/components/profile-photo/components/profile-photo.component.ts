import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  inject,
  ElementRef,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';

@Component({
  selector: 'app-profile-photo',
  imports: [BasicCard, Avatar, ButtonComponent, TextInput],
  templateUrl: './profile-photo.component.html',
  styleUrl: './profile-photo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoComponent {

  public readonly initials = input<string>('JD');
  public readonly photoUrl = input<string | null>(null);
  public readonly fileSelected = output<File>();
  public readonly removePhoto = output<void>();
  public readonly saveChanges = output<void>();

 
  private hostElement = inject(ElementRef);

  onFileButtonClick(): void {
    const inputElement = this.hostElement.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    inputElement?.click();
  }

  onFileChange(value: InputFieldValue): void {
    if (value instanceof FileList && value.length > 0) {
      this.fileSelected.emit(value[0]);
    }
  }
}
