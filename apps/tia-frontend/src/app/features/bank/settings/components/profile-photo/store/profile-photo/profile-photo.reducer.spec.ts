import { profilePhotoFeature } from './profile-photo.reducer';
import { ProfilePhotoActions } from './profile-photo.actions';
import { ProfilePhotoState, DefaultAvatarResponse } from './profile-photo.state';
import { environment } from '../../../../../../../../environments/environment';

describe('profilePhotoFeature reducer', () => {
  const initialState: ProfilePhotoState = {
    defaultAvatars: [],
    defaultAvatarsLoading: false,
    defaultAvatarsError: null,
    selectedAvatarId: null,
    uploadedFileName: null,
    currentAvatarUrl: null,
    savedAvatarUrl: null,
    avatarId: null,
    avatarType: null,
    userInitials: null,
    savingChanges: false,
  };

  it('should return the default state when action is unknown', () => {
    const action = { type: 'Unknown' } as any;
    const state = profilePhotoFeature.reducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  it('should handle loadDefaultAvatars', () => {
    const avatars: DefaultAvatarResponse[] = [
      { id: '1', iconUri: '/avatar-1.svg' },
    ];

    const state = profilePhotoFeature.reducer(
      initialState,
      ProfilePhotoActions.loadDefaultAvatars({ avatars: avatars.map(avatar => ({ ...avatar, imageUrl: `${environment.apiUrl}${avatar.iconUri}` })) }),
    );

    expect(state.defaultAvatars).toEqual(avatars.map(avatar => ({ ...avatar, imageUrl: `${environment.apiUrl}${avatar.iconUri}` })));
    expect(state.defaultAvatarsLoading).toBe(false);
    expect(state.defaultAvatarsError).toBeNull();
  });

  it('should handle selectDefaultAvatar', () => {
    const state = profilePhotoFeature.reducer(
      initialState,
      ProfilePhotoActions.selectDefaultAvatar({
        avatarId: 'avatar-1',
        imageUrl: '/avatar-1.svg',
      }),
    );

    expect(state.selectedAvatarId).toBe('avatar-1');
    expect(state.currentAvatarUrl).toBe('/avatar-1.svg');
    expect(state.uploadedFileName).toBeNull();
  });

  it('should handle uploadFile', () => {
    const state = profilePhotoFeature.reducer(
      initialState,
      ProfilePhotoActions.uploadFile({
        fileName: 'photo.png',
        objectUrl: 'blob:photo',
      }),
    );

    expect(state.uploadedFileName).toBe('photo.png');
    expect(state.currentAvatarUrl).toBe('blob:photo');
    expect(state.selectedAvatarId).toBeNull();
  });

  it('should handle setCurrentAvatar', () => {
    const state = profilePhotoFeature.reducer(
      initialState,
      ProfilePhotoActions.setCurrentAvatar({
        avatarId: 'avatar-1',
        avatarType: 'default',
        avatarUrl: '/avatar-1.svg',
      }),
    );

    expect(state.avatarId).toBe('avatar-1');
    expect(state.avatarType).toBe('default');
    expect(state.currentAvatarUrl).toBe('/avatar-1.svg');
    expect(state.savedAvatarUrl).toBe('/avatar-1.svg');
    expect(state.uploadedFileName).toBeNull();
    expect(state.selectedAvatarId).toBe('avatar-1');
  });

  it('should handle removeAvatar', () => {
    const populatedState: ProfilePhotoState = {
      defaultAvatars: [],
      defaultAvatarsLoading: false,
      defaultAvatarsError: null,
      selectedAvatarId: 'avatar-1',
      uploadedFileName: 'photo.png',
      currentAvatarUrl: '/avatar-1.svg',
      savedAvatarUrl: '/avatar-1.svg',
      avatarId: 'avatar-1',
      avatarType: 'default',
      userInitials: null,
      savingChanges: false,
    };

    const state = profilePhotoFeature.reducer(
      populatedState,
      ProfilePhotoActions.removeAvatar(),
    );

    expect(state.uploadedFileName).toBeNull();
    expect(state.selectedAvatarId).toBeNull();
    expect(state.currentAvatarUrl).toBeNull();
    expect(state.savedAvatarUrl).toBeNull();
    expect(state.avatarId).toBeNull();
    expect(state.avatarType).toBeNull();
  });

  it('should handle clearUploadedFile', () => {
    const populatedState: ProfilePhotoState = {
      ...initialState,
      uploadedFileName: 'photo.png',
      userInitials: null,
      savingChanges: false,
    };

    const state = profilePhotoFeature.reducer(
      populatedState,
      ProfilePhotoActions.clearUploadedFile(),
    );

    expect(state.uploadedFileName).toBeNull();
  });

  

  it('should handle selectDefaultAvatarRequest', () => {
    const populatedState: ProfilePhotoState = {
      ...initialState,
      uploadedFileName: 'photo.png',
      userInitials: null,
      savingChanges: false,
    };

    const state = profilePhotoFeature.reducer(
      populatedState,
      ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId: 'avatar-1' }),
    );

    expect(state.selectedAvatarId).toBe('avatar-1');
    expect(state.uploadedFileName).toBeNull();
  });

  it('should handle resetProfilePhoto', () => {
    const populatedState: ProfilePhotoState = {
      defaultAvatars: [{ id: '1', imageUrl: '/avatar-1.svg' }],
      defaultAvatarsLoading: true,
      defaultAvatarsError: 'Error',
      selectedAvatarId: 'avatar-1',
      uploadedFileName: 'photo.png',
      currentAvatarUrl: '/avatar-1.svg',
      savedAvatarUrl: '/avatar-1.svg',
      avatarId: 'avatar-1',
      avatarType: 'default',
      userInitials: 'JD',
      savingChanges: true,
    };

    const state = profilePhotoFeature.reducer(
      populatedState,
      ProfilePhotoActions.resetProfilePhoto(),
    );

    expect(state.defaultAvatars).toEqual([{ id: '1', imageUrl: '/avatar-1.svg' }]);
    expect(state.selectedAvatarId).toBeNull();
    expect(state.currentAvatarUrl).toBeNull();
    expect(state.userInitials).toBeNull();
    expect(state.savingChanges).toBe(false);
  });

  it('should handle clearCurrentAvatar', () => {
    const populatedState: ProfilePhotoState = {
      ...initialState,
      currentAvatarUrl: '/avatar-1.svg',
      selectedAvatarId: 'avatar-1',
      uploadedFileName: 'photo.png',
    };

    const state = profilePhotoFeature.reducer(
      populatedState,
      ProfilePhotoActions.clearCurrentAvatar(),
    );

    expect(state.currentAvatarUrl).toBeNull();
    expect(state.selectedAvatarId).toBeNull();
    expect(state.uploadedFileName).toBeNull();
  });

  it('should handle setUserInitials', () => {
    const state = profilePhotoFeature.reducer(
      initialState,
      ProfilePhotoActions.setUserInitials({ initials: 'JD' }),
    );

    expect(state.userInitials).toBe('JD');
  });

  it('should handle loadDefaultAvatarsRequest', () => {
    const state = profilePhotoFeature.reducer(
      initialState,
      ProfilePhotoActions.loadDefaultAvatarsRequest({}),
    );

    expect(state.defaultAvatarsLoading).toBe(true);
    expect(state.defaultAvatarsError).toBeNull();
  });

  it('should handle loadDefaultAvatarsFailure', () => {
    const state = profilePhotoFeature.reducer(
      initialState,
      ProfilePhotoActions.loadDefaultAvatarsFailure({ error: 'Error loading avatars' }),
    );

    expect(state.defaultAvatarsLoading).toBe(false);
    expect(state.defaultAvatarsError).toBe('Error loading avatars');
  });

  it('should handle uploadAvatarRequest', () => {
    const state = profilePhotoFeature.reducer(
      initialState,
      ProfilePhotoActions.uploadAvatarRequest({ file: new File([''], 'test.png') }),
    );

    expect(state.savingChanges).toBe(true);
  });

  it('should handle uploadAvatarFailure', () => {
    const stateWithSaving: ProfilePhotoState = {
      ...initialState,
      savingChanges: true,
    };

    const state = profilePhotoFeature.reducer(
      stateWithSaving,
      ProfilePhotoActions.uploadAvatarFailure({ error: 'Upload failed' }),
    );

    expect(state.savingChanges).toBe(false);
  });
});

