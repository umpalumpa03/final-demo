import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfilePhotoComponent } from '../components/profile-photo/profile-photo.component';
import { UserInfoComponent } from '../components/user-info/user-info.component';
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
  selectSavingChanges,
} from '../store/profile-photo/profile-photo.selectors';
import { selectUserInfo } from '../../../../../../store/user-info/user-info.selectors';
import { TranslateService } from '@ngx-translate/core';
import { PersonalInfoActions } from '../../../../../../store/personal-info/pesronal-info.actions';
import {
  selectPersonalInfo,
  selectPId,
  selectPhoneNumber,
  selectPersonalInfoLoading,
  selectPersonalInfoError,
} from '../../../../../../store/personal-info/personal-info.selectors';

@Component({
  selector: 'app-profile-photo-container',
  imports: [ProfilePhotoComponent, UserInfoComponent],
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
  public readonly savingChanges = this.store.selectSignal(selectSavingChanges);
  public readonly userInfo = this.store.selectSignal(selectUserInfo);
  public readonly personalInfo = this.store.selectSignal(selectPersonalInfo);
  public readonly pId = this.store.selectSignal(selectPId);
  public readonly phoneNumber = this.store.selectSignal(selectPhoneNumber);
  public readonly personalInfoLoading = this.store.selectSignal(selectPersonalInfoLoading);
  public readonly personalInfoError = this.store.selectSignal(selectPersonalInfoError);
  public readonly personalInfoUpdated = signal<boolean>(false);


  public readonly editedPId = signal<string>('');
  public readonly isEditingPId = signal<boolean>(false);
  public readonly isPersonalNumberUnchanged = computed(() => {
    const currentPId = this.pId()?.trim() || '';
    const editedPId = this.editedPId()?.trim() || '';
    return currentPId === editedPId;
  });

  public readonly userInitials = computed(() => {
    const fullName = this.userInfo()?.fullName;
    if (!fullName) return '';
    
    const nameParts = fullName.trim().split(/\s+/).filter(part => part.length > 0);
    if (nameParts.length === 0) return '';
    
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}.${lastInitial}`;
  });

  public readonly alertKind = signal<AlertType | null>(null);
  public readonly alertMessage = signal<string>('');
  public readonly alertType = computed<AlertType | null>(() => this.alertKind());
  public readonly isUploadModalOpen = signal<boolean>(false);
  public readonly isDragOver = signal<boolean>(false);
  
  private uploadedFile: File | null = null;
  private objectUrl: string | null = null;
  private alertTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isUpdatingPersonalInfo = false;
  private originalPIdBeforeUpdate: string | null = null;

  public constructor() {
    effect(() => {
      const fileName = this.uploadedFileName();
      if (!fileName && this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }
    });

   
    effect(() => {
      const currentPId = this.pId();
      if (!this.isEditingPId()) {
        this.editedPId.set(currentPId || '');
      }
    });


    effect(() => {
      const updated = this.personalInfoUpdated();
      if (updated && this.isEditingPId()) {
        this.isEditingPId.set(false);
      }
    });


    let previousLoading = false;
    effect(() => {
      const personalInfo = this.personalInfo();
      const error = this.personalInfoError();
      const loading = personalInfo?.loading ?? false;
      
      const loadingFinished = previousLoading && !loading;
      previousLoading = loading;

    
      if (loadingFinished && this.isUpdatingPersonalInfo) {
        if (error === null) {
          this.showAlert(
            'success',
            this.translate.instant('settings.profile-photo.personalNumberUpdated'),
          );
          this.personalInfoUpdated.set(true);
          setTimeout(() => this.personalInfoUpdated.set(false), 0);
          this.originalPIdBeforeUpdate = null; 
        } else if (error) {
          this.showAlert(
            'error',
            error,
          );
        
          if (this.isEditingPId()) {
            const originalValue = this.originalPIdBeforeUpdate || '';
            this.editedPId.set(originalValue);
            if (this.originalPIdBeforeUpdate !== null) {
              this.store.dispatch(
                PersonalInfoActions.loadPersonalInfoPId({ pId: this.originalPIdBeforeUpdate })
              );
            }
            this.originalPIdBeforeUpdate = null;
          }
        }
        this.isUpdatingPersonalInfo = false;
      }
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(ProfilePhotoActions.loadDefaultAvatarsRequest({}));
    this.store.dispatch(PersonalInfoActions.loadPersonalInfo());
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
    
    this.store.dispatch(ProfilePhotoActions.clearCurrentAvatar());
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
      return;
    }


    if (this.savedAvatarUrl() && !this.currentAvatarUrl()) {
    
      this.store.dispatch(ProfilePhotoActions.removeAvatar());
      this.store.dispatch(ProfilePhotoActions.removeAvatarRequest());
      
     
      const initials = this.userInitials();
      if (initials) {
        this.store.dispatch(ProfilePhotoActions.setUserInitials({ initials }));
      }
    }
  }

  public onEditPersonalNumber(): void {
    this.isEditingPId.set(true);
  }

  public onPersonalNumberChange(value: string | number | boolean | FileList | null): void {
    this.editedPId.set(value ? String(value) : '');
  }

  public onCancelEditPersonalNumber(): void {
    this.isEditingPId.set(false);
    this.editedPId.set(this.pId() || '');
  }

  public onUpdatePersonalNumber(pId: string | null): void {
    if (!pId || pId.length !== 11) {
      this.showAlert(
        'error',
        this.translate.instant('settings.profile-photo.invalidPersonalNumber'),
      );
      return;
    }

 
    const currentPId = this.pId();
    if (currentPId === pId) {
      return;
    }

    
    this.originalPIdBeforeUpdate = currentPId;

    this.isUpdatingPersonalInfo = true;
    this.store.dispatch(
      PersonalInfoActions.updatePersonalInfo({
        personalInfo: {
          ...this.personalInfo(),
          pId,
        },
      })
    );
  }
}

