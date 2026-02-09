import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ProfilePhotoComponent } from '../components/profile-photo/profile-photo.component';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { AlertType } from '../shared/models/profile-photo.models';
import { ProfilePhotoActions } from '../store/profile-photo/profile-photo.actions';
import { OtpModal } from '../../../../../../shared/lib/overlay/ui-otp-modal/otp-modal';
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
import { UserInfoActions } from '../../../../../../store/user-info/user-info.actions';
import { Routes } from '../../../../../../core/auth/models/tokens.model';
import { TranslateService } from '@ngx-translate/core';
import { PersonalInfoActions } from '../../../../../../store/personal-info/pesronal-info.actions';
import {
  selectPersonalInfo,
  selectPId,
  selectPhoneNumber,
  selectPersonalInfoLoading,
  selectPersonalInfoError,
  selectPhoneUpdateChallengeId,
  selectPhoneUpdateLoading,
  selectPhoneUpdateError,
  selectPhoneUpdateResendCount,
} from '../../../../../../store/personal-info/personal-info.selectors';

@Component({
  selector: 'app-profile-photo-container',
  imports: [ProfilePhotoComponent, UserInfoComponent, OtpModal, TranslatePipe],
  templateUrl: './profile-photo-container.html',
  styleUrl: './profile-photo-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoContainer implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

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
  public readonly phoneUpdateChallengeId = this.store.selectSignal(selectPhoneUpdateChallengeId);
  public readonly phoneUpdateLoading = this.store.selectSignal(selectPhoneUpdateLoading);
  public readonly phoneUpdateError = this.store.selectSignal(selectPhoneUpdateError);
  public readonly phoneUpdateResendCount = this.store.selectSignal(selectPhoneUpdateResendCount);

  public readonly editedPId = signal<string>('');
  public readonly isEditing = signal<boolean>(false);
  public readonly isPersonalNumberUnchanged = computed(() => {
    const currentPId = this.pId()?.trim() || '';
    const editedPId = this.editedPId()?.trim() || '';
    return currentPId === editedPId;
  });

  public readonly editedPhoneNumber = signal<string>('');
  public readonly isPhoneNumberUnchanged = computed(() => {
    const currentPhone = this.phoneNumber()?.trim() || '';
    const editedPhone = this.editedPhoneNumber()?.trim() || '';
    return currentPhone === editedPhone;
  });
  public readonly isOtpModalOpen = signal<boolean>(false);
  public readonly saveDisabledReason = computed(() => {
    if (this.phoneUpdateLoading() || this.personalInfoLoading()) {
      return null; 
    }
    if (this.isPhoneNumberUnchanged() && this.isPersonalNumberUnchanged()) {
      return this.translate.instant('settings.profile-photo.noChangesToSave');
    }
    return null;
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
    return `${firstInitial}${lastInitial}`;
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
  private originalPhoneBeforeUpdate: string | null = null;

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
      if (!this.isEditing()) {
        this.editedPId.set(currentPId || '');
      }
    });

    effect(() => {
      const currentPhone = this.phoneNumber();
      if (!this.isEditing()) {
        this.editedPhoneNumber.set(currentPhone || '');
      }
    });


    effect(() => {
      const updated = this.personalInfoUpdated();
      if (updated && this.isEditing()) {
        this.isEditing.set(false);
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
        
          if (this.isEditing()) {
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


    effect(() => {
      const challengeId = this.phoneUpdateChallengeId();
      if (challengeId && !this.isOtpModalOpen()) {
        this.isOtpModalOpen.set(true);
      }
    });

 
    let previousChallengeId: string | null = null;
    let previousPhoneUpdateLoading = false;
    
    effect(() => {
      const challengeId = this.phoneUpdateChallengeId();
      const loading = this.phoneUpdateLoading();
      const error = this.phoneUpdateError();
      const loadingFinished = previousPhoneUpdateLoading && !loading;
      const challengeIdCleared = previousChallengeId !== null && challengeId === null;
      
      previousChallengeId = challengeId;
      previousPhoneUpdateLoading = loading;

 
      if (challengeIdCleared && !error && loadingFinished) {
        this.showAlert(
          'success',
          this.translate.instant('settings.profile-photo.phoneNumberUpdated'),
        );
        this.isEditing.set(false);
        this.isOtpModalOpen.set(false);
        this.store.dispatch(PersonalInfoActions.loadPersonalInfo({ forceRefresh: true }));
      }
      
 
      if (loadingFinished && error && challengeId) {
        this.showAlert('error', error);
      }
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(ProfilePhotoActions.loadDefaultAvatarsRequest({}));
    this.store.dispatch(PersonalInfoActions.loadPersonalInfo({}));
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

  public onEdit(): void {
    this.isEditing.set(true);
  }

  public onPersonalNumberChange(value: string | number | boolean | FileList | null): void {
    this.editedPId.set(value ? String(value) : '');
  }

  public onPhoneNumberChange(value: string | number | boolean | FileList | null): void {
    this.editedPhoneNumber.set(value ? String(value) : '');
  }

  public onCancelEdit(): void {
    this.isEditing.set(false);
    this.editedPId.set(this.pId() || '');
    this.editedPhoneNumber.set(this.phoneNumber() || '');
  }

  public onSave(): void {
    const editedPhone = this.editedPhoneNumber()?.trim() || '';
    const editedPId = this.editedPId()?.trim() || '';
    const currentPhone = this.phoneNumber()?.trim() || '';
    const currentPId = this.pId()?.trim() || '';

    const phoneChanged = editedPhone !== currentPhone;
    const pIdChanged = editedPId !== currentPId;

  
    if (phoneChanged) {
      if (!editedPhone || editedPhone.length !== 9) {
        this.showAlert(
          'error',
          this.translate.instant('settings.profile-photo.invalidPhoneNumber'),
        );
        return;
      }
    }

   
    if (pIdChanged) {
      if (!editedPId || editedPId.length !== 11) {
        this.showAlert(
          'error',
          this.translate.instant('settings.profile-photo.invalidPersonalNumber'),
        );
        return;
      }
    }

   
    if (!phoneChanged && !pIdChanged) {
      this.isEditing.set(false);
      return;
    }


    if (pIdChanged) {
      this.originalPIdBeforeUpdate = currentPId;
      this.isUpdatingPersonalInfo = true;
      this.store.dispatch(
        PersonalInfoActions.updatePersonalInfo({
          personalInfo: {
            ...this.personalInfo(),
            pId: editedPId,
          },
        })
      );
    }


    if (phoneChanged) {
      this.originalPhoneBeforeUpdate = currentPhone;
      this.store.dispatch(
        PersonalInfoActions.initiatePhoneUpdate({ phone: editedPhone })
      );
    }
  }

  public onOtpModalClosed(): void {
    this.isOtpModalOpen.set(false);
    if (this.phoneUpdateChallengeId()) {
      this.store.dispatch(PersonalInfoActions.resetPhoneUpdate());

      this.editedPhoneNumber.set(this.originalPhoneBeforeUpdate || this.phoneNumber() || '');
    }
  }

  public onVerifyOtp(code: string): void {
    const challengeId = this.phoneUpdateChallengeId();
    if (challengeId) {
      this.store.dispatch(
        PersonalInfoActions.verifyPhoneUpdate({ challengeId, code })
      );
    }
  }

  public onResendOtp(): void {
    const challengeId = this.phoneUpdateChallengeId();
    const resendCount = this.phoneUpdateResendCount();
    if (challengeId && resendCount < 3) {
      this.store.dispatch(
        PersonalInfoActions.resendPhoneOTP({ challengeId })
      );
    } else if (resendCount >= 3) {
      this.showAlert(
        'error',
        this.translate.instant('settings.profile-photo.maxResendReached'),
      );
    }
  }

  public onImageLoadError(): void {

    this.store.dispatch(ProfilePhotoActions.clearCurrentAvatar());
  }

  public onStartTour(): void {
    this.store.dispatch(UserInfoActions.updateOnboardingStatus({ completed: false }));
    this.router.navigate([Routes.DASHBOARD]);
  }
}

