import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfilePhotoComponent } from '../components/profile-photo/profile-photo.component';
import { AlertType } from '../shared/models/profile-photo.models';
import { ProfilePhotoActions } from '../store/profile-photo/profile-photo.actions';
import {
  selectDefaultAvatars,
  selectDefaultAvatarsLoading,
  selectSelectedAvatarId,
  selectCurrentAvatarUrl,
  selectUploadedFileName,
  selectAvatarId,
  selectAvatarType,
  selectSavedAvatarUrl,
} from '../store/profile-photo/profile-photo.selectors';
import { selectUserInfo } from '../../../../../../store/user-info/user-info.selectors';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-photo-container',
  imports: [ProfilePhotoComponent],
  templateUrl: './profile-photo-container.html',
  styleUrl: './profile-photo-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoContainer implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  public readonly defaultAvatars = this.store.selectSignal(selectDefaultAvatars);
  public readonly defaultAvatarsLoading = this.store.selectSignal(selectDefaultAvatarsLoading);
  public readonly selectedAvatarId = this.store.selectSignal(selectSelectedAvatarId);
  public readonly currentAvatarUrl = this.store.selectSignal(selectCurrentAvatarUrl);
  public readonly uploadedFileName = this.store.selectSignal(selectUploadedFileName);
  public readonly avatarId = this.store.selectSignal(selectAvatarId);
  public readonly avatarType = this.store.selectSignal(selectAvatarType);
  public readonly savedAvatarUrl = this.store.selectSignal(selectSavedAvatarUrl);
  public readonly userInfo = this.store.selectSignal(selectUserInfo);

  public readonly alertKind = signal<AlertType | null>(null);
  public readonly alertMessage = signal<string>('');
  public readonly alertType = computed<AlertType | null>(() => this.alertKind());
  public readonly isUploadModalOpen = signal<boolean>(false);
  public readonly isDragOver = signal<boolean>(false);
  
  private uploadedFile: File | null = null;
  private objectUrl: string | null = null;
  private alertTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public constructor() {
    effect(() => {
      const fileName = this.uploadedFileName();
      if (!fileName && this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(ProfilePhotoActions.loadDefaultAvatarsRequest({}));
  }

  public ngOnDestroy(): void {
   if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }

    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }
  }

  private showAlert(kind: AlertType, message: string, autoHideMs = 3500): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }

    this.alertKind.set(kind);
    this.alertMessage.set(message);

    this.alertTimeoutId = setTimeout(() => {
      this.alertKind.set(null);
      this.alertMessage.set('');
      this.alertTimeoutId = null;
    }, autoHideMs);
  }

  public onAlertClose(): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }
    this.alertKind.set(null);
    this.alertMessage.set('');
  }

  public onOpenUploadModal(): void {
    this.isUploadModalOpen.set(true);
  }

  public onCloseUploadModal(): void {
    this.isUploadModalOpen.set(false);
    this.isDragOver.set(false);
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  public onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    this.onFileSelected(file);
    this.isUploadModalOpen.set(false);
  }

  public onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.onFileSelected(file);
    this.isUploadModalOpen.set(false);
    input.value = '';
  }

  public onFileSelected(file: File): void {
    const allowedTypes = ['image/png', 'image/jpeg'];
    const maxSizeBytes = 1024*1024; 

    const isValidType = allowedTypes.includes(file.type);
    const isValidSize = file.size <= maxSizeBytes;

    if (!isValidType || !isValidSize) {
      this.showAlert(
        'error',
        this.translate.instant('settings.profile-photo.invalidFileAlert'),
      );
      return;
    }

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
 
    const avatar = this.defaultAvatars().find(a => a.id === avatarId);
    if (!avatar) {
      return;
    }

    if (this.uploadedFile && this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.uploadedFile = null;

    this.store.dispatch(
      ProfilePhotoActions.selectDefaultAvatar({ avatarId, imageUrl: avatar.imageUrl })
    );
  }

  public onRemovePhoto(): void {
    const hasUnsavedFile = !!this.uploadedFile || !!this.uploadedFileName();
    const hasSavedAvatarUrl = !!this.savedAvatarUrl();
    const currentUrl = this.currentAvatarUrl();
    const savedUrl = this.savedAvatarUrl();

    const hasUnsavedSelection =
      (!!currentUrl && currentUrl !== savedUrl) || hasUnsavedFile;

  
    if (hasUnsavedSelection && hasSavedAvatarUrl) {
      const avatarId = this.avatarId();
      const avatarType = this.avatarType();

      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }
      this.uploadedFile = null;

      if (avatarId && avatarType && savedUrl) {
        this.store.dispatch(
          ProfilePhotoActions.setCurrentAvatar({
            avatarId,
            avatarType,
            avatarUrl: savedUrl,
          }),
        );
      }

      this.store.dispatch(ProfilePhotoActions.clearUploadedFile());
      return;
    }

   
    this.showAlert(
      'warning',
      this.translate.instant('settings.profile-photo.profilePictureRemovedSuccessfully'),
    );
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.uploadedFile = null;
    this.store.dispatch(ProfilePhotoActions.removeAvatar());
    this.store.dispatch(ProfilePhotoActions.removeAvatarRequest());
  }

  public onSaveChanges(): void {
    const file = this.uploadedFile;
    const avatarId = this.selectedAvatarId();

    if (file) {
      this.showAlert(
        'success',
        this.translate.instant('settings.profile-photo.profilePictureChangedSuccessfully'),
      );
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }
      this.store.dispatch(ProfilePhotoActions.uploadAvatarRequest({ file }));
      this.uploadedFile = null;
      return;
    }

    if (avatarId) {
      this.showAlert(
        'success',
        this.translate.instant('settings.profile-photo.profilePictureChangedSuccessfully'),
      );
      this.store.dispatch(
        ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId })
      );
    }
  }
}

