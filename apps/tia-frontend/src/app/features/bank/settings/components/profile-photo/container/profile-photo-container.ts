import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ProfilePhotoComponent } from '../components/profile-photo/profile-photo.component';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { ProfilePhotoActions } from '../store/profile-photo/profile-photo.actions';
import { UiModal } from '../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { personalInfoOtpConfig } from '../config/otp.config';
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
import { AlertService } from '@tia/core/services/alert/alert.service';
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
import { OtpVerification } from '@tia/core/otp-verification/container/otp-verification';
import { OtpResendTypes } from '@tia/core/otp-verification/config/otp.config';

@Component({
  selector: 'app-profile-photo-container',
  imports: [ProfilePhotoComponent, UserInfoComponent, OtpVerification, UiModal],
  templateUrl: './profile-photo-container.html',
  styleUrl: './profile-photo-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoContainer implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

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
  public readonly otpResendType = OtpResendTypes.PERSONAL_INFO

  public readonly otpConfig = personalInfoOtpConfig;

  public readonly editedPId = signal<string>('');
  public readonly isEditing = signal<boolean>(false);
  public readonly isPersonalNumberUnchanged = computed(() => {
    const currentPId = this.pId()?.trim() || '';
    const editedPId = this.editedPId()?.trim() || '';

  
    if (currentPId) {
      return true;
    }

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

  public readonly isUploadModalOpen = signal<boolean>(false);
  public readonly isDragOver = signal<boolean>(false);
  

  public readonly mainAvatarLoading = signal<boolean>(false);
  public readonly defaultAvatarsLoadingMap = signal<Map<string, boolean>>(new Map());
  
  private uploadedFile: File | null = null;
  private objectUrl: string | null = null;
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
          this.alertService.success(
            this.translate.instant('settings.profile-photo.personalNumberUpdated'),
            { variant: 'dismissible', title: 'Success!' },
          );
          this.personalInfoUpdated.set(true);
          setTimeout(() => this.personalInfoUpdated.set(false), 0);
          this.originalPIdBeforeUpdate = null; 
        } else if (error) {
          this.alertService.error(error, { variant: 'dismissible', title: 'Oops!' });
        
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
        this.alertService.success(
          this.translate.instant('settings.profile-photo.phoneNumberUpdated'),
          { variant: 'dismissible', title: 'Success!' },
        );
        this.isEditing.set(false);
        this.isOtpModalOpen.set(false);
        this.store.dispatch(PersonalInfoActions.loadPersonalInfo({ forceRefresh: true }));
      }
      
 
      if (loadingFinished && error && challengeId) {
        this.alertService.error(error, { variant: 'dismissible', title: 'Oops!' });
      }

      if (loadingFinished && error && !challengeId) {
        this.alertService.error(error, { variant: 'dismissible', title: 'Oops!' });
        const phoneToRestore = this.originalPhoneBeforeUpdate || this.phoneNumber() || '';
        this.editedPhoneNumber.set(phoneToRestore);
        this.store.dispatch(PersonalInfoActions.resetPhoneUpdate());
        this.originalPhoneBeforeUpdate = null;
      }
    });

    effect(() => {
      const url = this.currentAvatarUrl();
      if (url) {
        this.mainAvatarLoading.set(true);
      } else {
        this.mainAvatarLoading.set(false);
      }
    });

   
    effect(() => {
      const avatars = this.defaultAvatars();
      const loadingMap = new Map<string, boolean>();
      avatars.forEach(avatar => {
        loadingMap.set(avatar.id, true);
      });
      this.defaultAvatarsLoadingMap.set(loadingMap);
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(ProfilePhotoActions.loadDefaultAvatarsRequest({}));
    
    
    const currentPId = this.pId();
    const currentPhone = this.phoneNumber();
    const hasCachedData = !!(currentPId || (currentPhone && currentPhone.trim() !== ''));
    
    if (!hasCachedData) {
      this.store.dispatch(PersonalInfoActions.loadPersonalInfo({}));
    }
  }

  public ngOnDestroy(): void {
   if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
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
      this.alertService.error(
        this.translate.instant('settings.profile-photo.invalidFileAlert'),
        { variant: 'dismissible', title: 'Oops!' },
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

    
    const hasPhotoToRemove = !!currentUrl || hasUnsavedFile || hasSavedAvatarUrl;
    
    if (!hasPhotoToRemove) {
     
      return;
    }

  
    this.alertService.warning(
      this.translate.instant('settings.profile-photo.profilePictureRemovedSuccessfully'),
      { variant: 'dismissible', title: 'Success!' },
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
      this.alertService.success(
        this.translate.instant('settings.profile-photo.profilePictureChangedSuccessfully'),
        { variant: 'dismissible', title: 'Success!' },
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
      this.alertService.success(
        this.translate.instant('settings.profile-photo.profilePictureChangedSuccessfully'),
        { variant: 'dismissible', title: 'Success!' },
      );
      this.store.dispatch(
        ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId })
      );
      return;
    }


    if (this.savedAvatarUrl() && !this.currentAvatarUrl()) {
      this.alertService.success(
        this.translate.instant('settings.profile-photo.profilePictureChangedSuccessfully'),
        { variant: 'dismissible', title: 'Success!' },
      );
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
    const currentPId = this.pId()?.trim() || '';
    if (currentPId) {
      return;
    }
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

    const canEditPId = !currentPId;
    const pIdChanged = canEditPId && editedPId !== currentPId;

  
    if (phoneChanged) {
      if (!editedPhone || editedPhone.length !== 9) {
        this.alertService.error(
          this.translate.instant('settings.profile-photo.invalidPhoneNumber'),
          { variant: 'dismissible', title: 'Oops!' },
        );
        return;
      }
    }

   
    if (pIdChanged) {
      if (!editedPId || editedPId.length !== 11) {
        this.alertService.error(
          this.translate.instant('settings.profile-photo.invalidPersonalNumber'),
          { variant: 'dismissible', title: 'Oops!' },
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

  public onVerifyOtp(otp: string): void {
      const challengeId = this.phoneUpdateChallengeId();
      if (challengeId) {
        this.store.dispatch(
          PersonalInfoActions.verifyPhoneUpdate({ challengeId, code: otp })
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
        this.alertService.error(
          this.translate.instant('settings.profile-photo.maxResendReached'),
          { variant: 'dismissible', title: 'Oops!' },
        );
      }
  }

  public onImageLoadError(): void {
    this.mainAvatarLoading.set(false);
    this.store.dispatch(ProfilePhotoActions.clearCurrentAvatar());
  }

  public onMainImageLoad(): void {
    this.mainAvatarLoading.set(false);
  }

  public onDefaultAvatarLoad(avatarId: string): void {
    const currentMap = this.defaultAvatarsLoadingMap();
    const newMap = new Map(currentMap);
    newMap.set(avatarId, false);
    this.defaultAvatarsLoadingMap.set(newMap);
  }

  public onDefaultAvatarError(avatarId: string): void {
    const currentMap = this.defaultAvatarsLoadingMap();
    const newMap = new Map(currentMap);
    newMap.set(avatarId, false);
    this.defaultAvatarsLoadingMap.set(newMap);
  }

  public onStartTour(): void {
    this.store.dispatch(UserInfoActions.updateOnboardingStatus({ completed: false }));
    this.router.navigate([Routes.DASHBOARD]);
  }
}

