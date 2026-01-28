import { ChangeDetectionStrategy, Component, OnDestroy, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfilePhotoComponent } from '../components/profile-photo/profile-photo.component';
import { ProfilePhotoActions } from '../../../../../../store/profile-photo/profile-photo.actions';
import {
  selectDefaultAvatars,
  selectSelectedAvatarId,
  selectCurrentAvatarUrl,
  selectUploadedFileName,
} from '../../../../../../store/profile-photo/profile-photo.selectors';

@Component({
  selector: 'app-profile-photo-container',
  imports: [ProfilePhotoComponent],
  templateUrl: './profile-photo-container.html',
  styleUrl: './profile-photo-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoContainer implements OnDestroy {
  private readonly store = inject(Store);

  public readonly defaultAvatars = this.store.selectSignal(selectDefaultAvatars);
  public readonly selectedAvatarId = this.store.selectSignal(selectSelectedAvatarId);
  public readonly currentAvatarUrl = this.store.selectSignal(selectCurrentAvatarUrl);
  public readonly uploadedFileName = this.store.selectSignal(selectUploadedFileName);
  
  private uploadedFile: File | null = null;
  private objectUrl: string | null = null;

  constructor() {

    effect(() => {
      const fileName = this.uploadedFileName();
      if (!fileName && this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }
    });
  }

  ngOnDestroy(): void {
   if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  public onFileSelected(file: File): void {
    this.uploadedFile = file;

    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }

    this.objectUrl = URL.createObjectURL(file);
    this.store.dispatch(
      ProfilePhotoActions.uploadFile({
        fileName: file.name,
        objectUrl: this.objectUrl,
      })
    );
  }

  public onSelectDefaultAvatar(avatarId: string): void {
    this.store.dispatch(
      ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId })
    );
  }

  public onRemovePhoto(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.uploadedFile = null;
    this.store.dispatch(ProfilePhotoActions.removeAvatarRequest());
  }

  public onSaveChanges(): void {
    const file = this.uploadedFile;
    const avatarId = this.selectedAvatarId();

    if (file) {
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }
      this.store.dispatch(ProfilePhotoActions.uploadAvatarRequest({ file }));
      this.uploadedFile = null;
      return;
    }

    if (avatarId) {
      this.store.dispatch(
        ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId })
      );
    }
  }
}

