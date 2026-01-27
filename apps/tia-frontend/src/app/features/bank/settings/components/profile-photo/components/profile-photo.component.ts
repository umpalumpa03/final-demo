import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { DefaultAvatarResponse } from '../../../../../../store/profile-photo/profile-photo.state';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-profile-photo',
  imports: [BasicCard, Avatar, ButtonComponent],
  templateUrl: './profile-photo.component.html',
  styleUrl: './profile-photo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoComponent {
  public readonly initials = input<string>('');
  public readonly photoUrl = input<string | null>(null);
  public readonly defaultAvatars = input<DefaultAvatarResponse[]>([]);
  public readonly selectedAvatarId = input<string | null>(null);
  public readonly fileSelected = output<File>();
  public readonly removePhoto = output<void>();
  public readonly saveChanges = output<void>();
  public readonly selectDefaultAvatar = output<string>();

  public onFileButtonClick(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.addEventListener('change', (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        this.fileSelected.emit(fileInput.files[0]);
      }

      document.body.removeChild(input);
    });
    
    document.body.appendChild(input);
    input.click();
  }

  public onDefaultAvatarClick(avatarId: string): void {
    this.selectDefaultAvatar.emit(avatarId);
  }

  public getAvatarUrl(iconUri: string): string {
    return `${environment.apiUrl}${iconUri}`;
  }
}
