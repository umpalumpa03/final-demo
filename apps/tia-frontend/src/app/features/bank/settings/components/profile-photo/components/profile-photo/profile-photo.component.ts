import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  effect,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { DismissibleAlerts } from '@tia/shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';
import { TranslatePipe } from '@ngx-translate/core';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { AlertType } from '../../shared/models/profile-photo.models';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { DefaultAvatarWithUrl } from '../../store/profile-photo/profile-photo.state';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-profile-photo',
  imports: [
    BasicCard,
    ButtonComponent,
    DismissibleAlerts,
    TranslatePipe,
    Spinner,
    Avatar,
    UiModal,
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
  public readonly alertType = input<AlertType | null>(null);
  public readonly alertMessage = input<string>('');
  public readonly isUploadModalOpen = input<boolean>(false);
  public readonly isDragOver = input<boolean>(false);
  public readonly savingChanges = input<boolean>(false);

  public readonly openUploadModal = output<void>();
  public readonly alertClose = output<void>();
  public readonly removePhoto = output<void>();
  public readonly saveChanges = output<void>();
  public readonly selectDefaultAvatar = output<string>();
  public readonly uploadModalClosed = output<void>();
  public readonly dragOver = output<DragEvent>();
  public readonly dragLeave = output<DragEvent>();
  public readonly fileDrop = output<DragEvent>();
  public readonly fileInputChange = output<Event>();

  public onFileButtonClick(): void {
    this.openUploadModal.emit();
  }

  public onDefaultAvatarClick(avatarId: string): void {
    this.selectDefaultAvatar.emit(avatarId);
  }
}
