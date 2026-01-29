import { profilePhotoFeature } from './profile-photo.reducer';
import { ProfilePhotoActions } from './profile-photo.actions';
import { ProfilePhotoState, DefaultAvatarResponse } from './profile-photo.state';

describe('profilePhotoFeature reducer', () => {
  const initialState: ProfilePhotoState = {
    defaultAvatars: [],
    defaultAvatarsLoading: false,
    defaultAvatarsError: null,
    selectedAvatarId: null,
    uploadedFileName: null,
    currentAvatarUrl: null,
    avatarId: null,
    avatarType: null,
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
      ProfilePhotoActions.loadDefaultAvatars({ avatars }),
    );

    expect(state.defaultAvatars).toEqual(avatars);
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
      avatarId: 'avatar-1',
      avatarType: 'default',
    };

    const state = profilePhotoFeature.reducer(
      populatedState,
      ProfilePhotoActions.removeAvatar(),
    );

    expect(state.uploadedFileName).toBeNull();
    expect(state.selectedAvatarId).toBeNull();
    expect(state.currentAvatarUrl).toBeNull();
    expect(state.avatarId).toBeNull();
    expect(state.avatarType).toBeNull();
  });

  it('should handle clearUploadedFile', () => {
    const populatedState: ProfilePhotoState = {
      ...initialState,
      uploadedFileName: 'photo.png',
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
    };

    const state = profilePhotoFeature.reducer(
      populatedState,
      ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId: 'avatar-1' }),
    );

    expect(state.selectedAvatarId).toBe('avatar-1');
    expect(state.uploadedFileName).toBeNull();
  });
});

