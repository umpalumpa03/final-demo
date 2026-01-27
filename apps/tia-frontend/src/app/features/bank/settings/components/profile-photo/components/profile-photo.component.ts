import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { DefaultAvatar } from '../shared/models/profile-photo.model';

@Component({
  selector: 'app-profile-photo',
  imports: [BasicCard, Avatar, ButtonComponent, TextInput],
  templateUrl: './profile-photo.component.html',
  styleUrl: './profile-photo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoComponent {
  public readonly initials = input<string>('');
  public readonly photoUrl = input<string | null>(null);

  public readonly defaultAvatars = input<DefaultAvatar[]>([]);
  public readonly selectedAvatarId = input<string | null>(null);

  public readonly fileSelected = output<File>();
  public readonly removePhoto = output<void>();
  public readonly saveChanges = output<void>();
  public readonly selectDefaultAvatar = output<string>();

  @ViewChild('fileInput', { read: ElementRef })
  private fileInput?: ElementRef<HTMLElement>;

  public onFileButtonClick(): void {
    const inputElement = this.fileInput?.nativeElement.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;
    inputElement?.click();
  }

  public onFileChange(value: InputFieldValue): void {
    if (value instanceof FileList && value.length > 0) {
      this.fileSelected.emit(value[0]);
    }
  }

  public onDefaultAvatarClick(avatarId: string): void {
    this.selectDefaultAvatar.emit(avatarId);
  }
}
