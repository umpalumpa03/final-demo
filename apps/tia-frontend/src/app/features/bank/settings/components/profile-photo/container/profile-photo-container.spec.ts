import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { vi } from 'vitest';
import { ProfilePhotoActions } from '../../../../../../features/bank/settings/components/profile-photo/store/profile-photo/profile-photo.actions';
import { ProfilePhotoContainer } from './profile-photo-container';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DefaultAvatarResponse, DefaultAvatarWithUrl } from '../../../../../../features/bank/settings/components/profile-photo/store/profile-photo/profile-photo.state';
import {
  selectDefaultAvatars,
  selectCurrentAvatarUrl,
  selectSelectedAvatarId,
  selectUploadedFileName,
  selectAvatarId,
  selectAvatarType,
  selectSavedAvatarUrl,
} from '../../../../../../features/bank/settings/components/profile-photo/store/profile-photo/profile-photo.selectors';
import { selectPId, selectPersonalInfo, selectPhoneNumber, selectPhoneUpdateChallengeId, selectPhoneUpdateResendCount } from '../../../../../../store/personal-info/personal-info.selectors';
import { selectUserInfo } from '../../../../../../store/user-info/user-info.selectors';
import { PersonalInfoActions } from '../../../../../../store/personal-info/pesronal-info.actions';
import { environment } from '../../../../../../../environments/environment';

describe('ProfilePhotoContainer', () => {
  let component: ProfilePhotoContainer;
  let fixture: ComponentFixture<ProfilePhotoContainer>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePhotoContainer, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: {
            ProfilePhoto: {
              defaultAvatars: [],
              defaultAvatarsLoading: false,
              defaultAvatarsError: null,
              selectedAvatarId: null,
              uploadedFileName: null,
              currentAvatarUrl: null,
              avatarId: null,
              avatarType: null,
            },
            personalInfo: {
              pId: null,
              phoneNumber: null,
              loading: false,
              error: null,
            },
          },
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProfilePhotoContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch uploadFile when file is selected', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:photo');

    const file = new File(['content'], 'photo.png', { type: 'image/png' });

    component.onFileSelected(file);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProfilePhotoActions.uploadFile({
        fileName: 'photo.png',
        objectUrl: 'blob:photo',
      }),
    );
  });

  it('should dispatch clearCurrentAvatar on removePhoto', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.onRemovePhoto();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProfilePhotoActions.clearCurrentAvatar(),
    );
  });

  it('should dispatch uploadAvatarRequest when saving changes with uploaded file', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const file = new File(['content'], 'photo.png', { type: 'image/png' });
    (component as any).uploadedFile = file;

    component.onSaveChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProfilePhotoActions.uploadAvatarRequest({ file }),
    );
  });

  it('should dispatch selectDefaultAvatarRequest when saving with selected avatar id', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    (component as any).uploadedFile = null;
    store.overrideSelector(selectSelectedAvatarId, 'avatar-1');
    store.refreshState();

    component.onSaveChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId: 'avatar-1' }),
    );
  });

  it('should show error alert when file type is invalid', () => {
    const translate = TestBed.inject(TranslateService);
    const translateSpy = vi.spyOn(translate, 'instant').mockReturnValue('Invalid file type');
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const file = new File(['content'], 'photo.gif', { type: 'image/gif' });

    component.onFileSelected(file);

    expect(translateSpy).toHaveBeenCalledWith('settings.profile-photo.invalidFileAlert');
    expect(component.alertKind()).toBe('error');
    expect(component.alertMessage()).toBe('Invalid file type');
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch selectDefaultAvatar when avatar is found', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const avatars: DefaultAvatarResponse[] = [
      { id: 'avatar-1', iconUri: '/avatars/1.png' },
  
    ];

    store.overrideSelector(selectDefaultAvatars, avatars.map(avatar => ({ ...avatar, imageUrl: `${environment.apiUrl}${avatar.iconUri}` })) as DefaultAvatarWithUrl[]);
    store.refreshState();

    component.onSelectDefaultAvatar('avatar-1');

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProfilePhotoActions.selectDefaultAvatar({
        avatarId: 'avatar-1',
        imageUrl: expect.stringContaining('/avatars/1.png'),
      }),
    );
  });

  it('should show error alert when file size is too large', () => {
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('File too large');
    const largeContent = new Array(1024*1024 + 1).fill('a').join('');
    component.onFileSelected(new File([largeContent], 'large-photo.png', { type: 'image/png' }));
    expect(component.alertKind()).toBe('error');
  });

  it('should dispatch loadDefaultAvatarsRequest on ngOnInit', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(ProfilePhotoActions.loadDefaultAvatarsRequest({}));
  });

  it('should cleanup in ngOnDestroy', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    (component as any).objectUrl = 'blob:photo';
    (component as any).alertTimeoutId = setTimeout(() => {}, 100);
    component.ngOnDestroy();
    expect(revokeSpy).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should clear alert when onAlertClose is called', () => {
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Test');
    component.onFileSelected(new File(['content'], 'photo.gif', { type: 'image/gif' }));
    component.onAlertClose();
    expect(component.alertKind()).toBeNull();
  });

  it('should handle edge cases', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
    store.overrideSelector(selectDefaultAvatars, []);
    store.refreshState();
    component.onSelectDefaultAvatar('non-existent');
    (component as any).objectUrl = 'blob:photo';
    store.overrideSelector(selectUploadedFileName, null);
    store.refreshState();
    fixture.detectChanges();
    expect(revokeSpy).toHaveBeenCalled();
  });

  it('should open and close upload modal correctly', () => {
    component.onOpenUploadModal();
    expect(component.isUploadModalOpen()).toBe(true);

 
    (component as any).isDragOver.set(true);
    component.onCloseUploadModal();
    expect(component.isUploadModalOpen()).toBe(false);
    expect(component.isDragOver()).toBe(false);
  });

  it('should set drag state on drag over and leave', () => {
    const dragEvent = {
      preventDefault: vi.fn(),
    } as unknown as DragEvent;

    component.onDragOver(dragEvent);
    expect(dragEvent.preventDefault).toHaveBeenCalled();
    expect(component.isDragOver()).toBe(true);

    const leaveEvent = {
      preventDefault: vi.fn(),
    } as unknown as DragEvent;

    component.onDragLeave(leaveEvent);
    expect(leaveEvent.preventDefault).toHaveBeenCalled();
    expect(component.isDragOver()).toBe(false);
  });

  it('should ignore file input change when there are no files', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const input = document.createElement('input');
    Object.defineProperty(input, 'files', {
      value: null,
      writable: false,
    });

    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: input });

    component.onFileInputChange(event);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should ignore file drop when there are no files', () => {
    const onFileSelectedSpy = vi.spyOn(component as any, 'onFileSelected');

    const event = {
      preventDefault: vi.fn(),
      dataTransfer: {
        files: { length: 0 } as unknown as FileList,
      },
    } as unknown as DragEvent;

    component.onFileDrop(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onFileSelectedSpy).not.toHaveBeenCalled();
    expect(component.isDragOver()).toBe(false);
  });

  it('should revert to saved avatar and clear unsaved changes on removePhoto', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const file = new File(['content'], 'temp.png', { type: 'image/png' });
    (component as any).uploadedFile = file;

    store.overrideSelector(selectSavedAvatarUrl, 'https://images/saved.png');
    store.overrideSelector(selectCurrentAvatarUrl, 'blob:temp');
    store.overrideSelector(selectAvatarId, 'avatar-1');
    store.overrideSelector(selectAvatarType, 'default');
    store.overrideSelector(selectUploadedFileName, 'temp.png');
    store.refreshState();

    component.onRemovePhoto();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProfilePhotoActions.setCurrentAvatar({
        avatarId: 'avatar-1',
        avatarType: 'default',
        avatarUrl: 'https://images/saved.png',
      }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      ProfilePhotoActions.clearUploadedFile(),
    );
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      ProfilePhotoActions.removeAvatarRequest(),
    );
  });

  it('should dispatch removeAvatar when saving changes with no file or avatarId but has savedAvatarUrl', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    (component as any).uploadedFile = null;
    store.overrideSelector(selectSavedAvatarUrl, 'https://images/saved.png');
    store.overrideSelector(selectCurrentAvatarUrl, null);
    store.overrideSelector(selectSelectedAvatarId, null);
    store.refreshState();

    component.onSaveChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(ProfilePhotoActions.removeAvatar());
    expect(dispatchSpy).toHaveBeenCalledWith(ProfilePhotoActions.removeAvatarRequest());
  });

  it('should handle edit and cancel personal number', () => {
    store.overrideSelector(selectPId, '12345678901');
    store.overrideSelector(selectPhoneNumber, '555123456');
    store.refreshState();

    component.onEdit();
    expect(component.isEditing()).toBe(true);

    component.onCancelEdit();
    expect(component.isEditing()).toBe(false);
    expect(component.editedPId()).toBe('12345678901');
    expect(component.editedPhoneNumber()).toBe('555123456');
  });

  it('should validate personal number length on update', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Personal number must be exactly 11 digits');

    store.overrideSelector(selectPId, '12345678901');
    store.overrideSelector(selectPhoneNumber, '555123456');
    store.refreshState();

    component.onEdit();
    component.onPersonalNumberChange('12345');
    component.onSave();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.alertKind()).toBe('error');
  });

  it('should dispatch updatePersonalInfo when personal number is valid and different', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    store.overrideSelector(selectPId, '12345678901');
    store.overrideSelector(selectPhoneNumber, '555123456');
    store.overrideSelector(selectPersonalInfo, {
      pId: '12345678901',
      phoneNumber: '555123456',
      loading: false,
      error: null,
      phoneUpdateChallengeId: null,
      phoneUpdateLoading: false,
      phoneUpdateError: null,
      phoneUpdatePendingPhone: null,
      phoneUpdateResendCount: 0,
    });
    store.refreshState();

    component.onEdit();
    component.onPersonalNumberChange('98765432109');
    component.onSave();

    expect(dispatchSpy).toHaveBeenCalledWith(
      PersonalInfoActions.updatePersonalInfo({
        personalInfo: expect.objectContaining({
          pId: '98765432109',
        }),
      })
    );
  });

  it('should not update personal number when it is the same', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    store.overrideSelector(selectPId, '12345678901');
    store.overrideSelector(selectPhoneNumber, '555123456');
    store.refreshState();

    component.onEdit();
    component.onPersonalNumberChange('12345678901');
    component.onSave();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.isEditing()).toBe(false);
  });

  it('should set user initials when removing avatar with saved avatar', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    store.overrideSelector(selectSavedAvatarUrl, 'https://images/saved.png');
    store.overrideSelector(selectCurrentAvatarUrl, null);
    store.overrideSelector(selectSelectedAvatarId, null);
    store.overrideSelector(selectUserInfo, {
      fullName: 'John Doe',
      email: null,
      theme: null,
      language: null,
      avatar: null,
      role: null,
      loaded: true,
      loading: false,
      error: null,
      widgets: [],
      widgetsLoading: false,
      widgetsLoaded: false,
      hasCompletedOnboarding: false,
      birthday: null,
      birthdayModalClosedYear: null,
    });
    store.refreshState();

    (component as any).uploadedFile = null;
    component.onSaveChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(ProfilePhotoActions.removeAvatar());
    expect(dispatchSpy).toHaveBeenCalledWith(ProfilePhotoActions.setUserInitials({ initials: 'JD' }));
  });

  it('should handle onPersonalNumberChange', () => {
    component.onPersonalNumberChange('12345678901');
    expect(component.editedPId()).toBe('12345678901');

    component.onPersonalNumberChange(null);
    expect(component.editedPId()).toBe('');
  });

  it('should validate phone number length - must be exactly 9 digits', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Phone number must be exactly 9 digits');

    store.overrideSelector(selectPId, '12345678901');
    store.overrideSelector(selectPhoneNumber, '555123456');
    store.refreshState();

    component.onEdit();
    component.onPhoneNumberChange('5551234567'); 
    component.onSave();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.alertKind()).toBe('error');
    expect(component.alertMessage()).toBe('Phone number must be exactly 9 digits');
  });



  it('should dispatch initiatePhoneUpdate when phone number is valid and different', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    store.overrideSelector(selectPId, '12345678901');
    store.overrideSelector(selectPhoneNumber, '555123456');
    store.refreshState();

    component.onEdit();
    component.onPhoneNumberChange('555987654');
    component.onSave();

    expect(dispatchSpy).toHaveBeenCalledWith(
      PersonalInfoActions.initiatePhoneUpdate({ phone: '555987654' })
    );
  });

  it('should handle onOtpModalClosed', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    store.overrideSelector(selectPhoneUpdateChallengeId, 'challenge-123');
    store.overrideSelector(selectPhoneNumber, '555123456');
    store.refreshState();

    component.onOtpModalClosed();

    expect(component.isOtpModalOpen()).toBe(false);
    expect(dispatchSpy).toHaveBeenCalledWith(PersonalInfoActions.resetPhoneUpdate());
  });

  it('should handle onVerifyOtp', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    store.overrideSelector(selectPhoneUpdateChallengeId, 'challenge-123');
    store.refreshState();

    component.onVerifyOtp('123456');

    expect(dispatchSpy).toHaveBeenCalledWith(
      PersonalInfoActions.verifyPhoneUpdate({ challengeId: 'challenge-123', code: '123456' })
    );
  });

  it('should handle onResendOtp', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Max resend reached');
    store.overrideSelector(selectPhoneUpdateChallengeId, 'challenge-123');
    store.overrideSelector(selectPhoneUpdateResendCount, 2);
    store.refreshState();

    component.onResendOtp();

    expect(dispatchSpy).toHaveBeenCalledWith(
      PersonalInfoActions.resendPhoneOTP({ challengeId: 'challenge-123' })
    );
  });

  it('should show alert when resend count is 3 or more', () => {
    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'instant').mockReturnValue('Max resend reached');
    store.overrideSelector(selectPhoneUpdateChallengeId, 'challenge-123');
    store.overrideSelector(selectPhoneUpdateResendCount, 3);
    store.refreshState();

    component.onResendOtp();

    expect(component.alertKind()).toBe('error');
  });




});
