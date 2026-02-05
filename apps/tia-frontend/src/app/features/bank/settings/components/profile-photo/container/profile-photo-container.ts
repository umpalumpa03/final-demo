import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfilePhotoComponent } from '../components/profile-photo/profile-photo.component';
import { AlertType } from '../shared/models/profile-photo.models';
import { ProfilePhotoActions } from '../../../../../../store/profile-photo/profile-photo.actions';
import {
  selectDefaultAvatars,
  selectDefaultAvatarsLoading,
  selectSelectedAvatarId,
  selectCurrentAvatarUrl,
  selectUploadedFileName,
} from '../../../../../../store/profile-photo/profile-photo.selectors';
import { selectUserInfo } from '../../../../../../store/user-info/user-info.selectors';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../../environments/environment';

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
  public readonly userInfo = this.store.selectSignal(selectUserInfo);

  public readonly alertKind = signal<AlertType | null>(null);
  public readonly alertMessage = signal<string>('');
  public readonly alertType = computed<AlertType | null>(() => this.alertKind());
  
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

  public onFileSelected(file: File): void {
    const allowedTypes = ['image/png', 'image/jpeg'];
    const maxSizeBytes = 150 * 1024; 

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

    const imageUrl = `${environment.apiUrl}${avatar.iconUri}`;
    this.store.dispatch(
      ProfilePhotoActions.selectDefaultAvatar({ avatarId, imageUrl })
    );
  }

  public onRemovePhoto(): void {
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

