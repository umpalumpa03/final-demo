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

  it('should dispatch removeAvatarRequest on removePhoto', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.onRemovePhoto();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProfilePhotoActions.removeAvatar(),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      ProfilePhotoActions.removeAvatarRequest(),
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

});
