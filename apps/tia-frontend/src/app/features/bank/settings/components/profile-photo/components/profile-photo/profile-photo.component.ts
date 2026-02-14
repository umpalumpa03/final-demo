import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe } from '@ngx-translate/core';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { DefaultAvatarWithUrl } from '../../store/profile-photo/profile-photo.state';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-profile-photo',
  imports: [
    BasicCard,
    ButtonComponent,
    TranslatePipe,
    Avatar,
    UiModal,
    Skeleton,
  ],
  templateUrl: './profile-photo.component.html',
  styleUrl: './profile-photo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoComponent {
  public readonly initials = input<string>('');
  public readonly photoUrl = input<string | null>(null);
  public readonly defaultAvatars = input<DefaultAvatarWithUrl[]>([]);
  public readonly defaultAvatarsLoading = input<boolean>(false);
  public readonly selectedAvatarId = input<string | null>(null);
  public readonly isUploadModalOpen = input<boolean>(false);
  public readonly isDragOver = input<boolean>(false);
  public readonly savingChanges = input<boolean>(false);
  public readonly mainAvatarLoading = input<boolean>(false);
  public readonly defaultAvatarsLoadingMap = input<Map<string, boolean>>(new Map());

  public readonly openUploadModal = output<void>();
  public readonly removePhoto = output<void>();
  public readonly saveChanges = output<void>();
  public readonly selectDefaultAvatar = output<string>();
  public readonly uploadModalClosed = output<void>();
  public readonly dragOver = output<DragEvent>();
  public readonly dragLeave = output<DragEvent>();
  public readonly fileDrop = output<DragEvent>();
  public readonly fileInputChange = output<Event>();
  public readonly imageError = output<void>();
  public readonly mainImageLoad = output<void>();
  public readonly defaultAvatarLoad = output<string>();
  public readonly defaultAvatarError = output<string>();

  public onFileButtonClick(): void {
    this.openUploadModal.emit();
  }

  public onDefaultAvatarClick(avatarId: string): void {
    this.selectDefaultAvatar.emit(avatarId);
  }

  public onImageError(): void {
    this.imageError.emit();
  }

  public onMainImageLoad(): void {
    this.mainImageLoad.emit();
  }

  public onDefaultAvatarLoad(avatarId: string): void {
    this.defaultAvatarLoad.emit(avatarId);
  }

  public onDefaultAvatarError(avatarId: string): void {
    this.defaultAvatarError.emit(avatarId);
  }

  public isDefaultAvatarLoading(avatarId: string): boolean {
    return this.defaultAvatarsLoadingMap().get(avatarId) ?? false;
  }
}
