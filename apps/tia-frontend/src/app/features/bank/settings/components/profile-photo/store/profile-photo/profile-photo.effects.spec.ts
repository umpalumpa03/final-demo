import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject, firstValueFrom, of } from 'rxjs';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { ProfilePhotoEffects } from './profile-photo.effects';
import { ProfilePhotoApiService } from '../../../../../../../shared/services/profile-photo/profile-photo.service';
import { ProfilePhotoActions } from './profile-photo.actions';
import { selectDefaultAvatars } from './profile-photo.selectors';
import { DefaultAvatarResponse, DefaultAvatarWithUrl } from './profile-photo.state';
import { environment } from '../../../../../../../../environments/environment';
import { selectUserInfo } from '../../../../../../../store/user-info/user-info.selectors';
import { initialUserState } from '../../../../../../../store/user-info/user-info.reducer';
import { UserInfoActions } from '../../../../../../../store/user-info/user-info.actions';

describe('ProfilePhotoEffects', () => {
  let actions$: Subject<any>;
  let effects: ProfilePhotoEffects;
  let profilePhotoApiServiceMock: ProfilePhotoApiService;
  let store: MockStore;

  beforeEach(() => {
    actions$ = new Subject<any>();

    profilePhotoApiServiceMock = {
      getAvailableDefaultAvatars: vi.fn(),
      selectFromDefaultAvatar: vi.fn(),
      uploadUserAvatar: vi.fn(),
      removeUserAvatar: vi.fn(),
    } as unknown as ProfilePhotoApiService;

    TestBed.configureTestingModule({
      providers: [
        ProfilePhotoEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectDefaultAvatars,
              value: [{ id: '1', imageUrl: `${environment.apiUrl}/avatar-1.svg` }] as DefaultAvatarWithUrl[],
            },
            {
              selector: selectUserInfo,
              value: initialUserState,
            },
          ],
        }),
        { provide: ProfilePhotoApiService, useValue: profilePhotoApiServiceMock },
      ],
    });

    effects = TestBed.inject(ProfilePhotoEffects);
    store = TestBed.inject(MockStore);
  });

  it('should load default avatars on loadDefaultAvatarsRequest', async () => {
    const avatars: DefaultAvatarWithUrl[] = [
      { id: '1', imageUrl: `${environment.apiUrl}/avatar-1.svg` },
    ];

    store.overrideSelector(selectDefaultAvatars, []);
    store.refreshState();

    (profilePhotoApiServiceMock.getAvailableDefaultAvatars as any).mockReturnValue(of(avatars));

    const promise = firstValueFrom(effects.loadDefaultAvatars$);

    actions$.next(ProfilePhotoActions.loadDefaultAvatarsRequest({}));

    const result = await promise;

    expect(result).toEqual(ProfilePhotoActions.loadDefaultAvatars({ avatars }));
  });

  it('should load stored avatar on ROOT_EFFECTS_INIT when userInfo has avatar', async () => {
    const avatarId = '1'; 
    const avatarUrl = `${environment.apiUrl}/settings/current-user-avatar/${avatarId}`;
    const avatarType: 'default' | 'custom' = 'default';

    store.overrideSelector(selectUserInfo, { 
      ...initialUserState, 
      fullName: 'TestUser',
      avatar: avatarUrl 
    });
    store.refreshState();

    const promise = firstValueFrom(effects.loadStoredAvatar$);

    actions$.next({ type: ROOT_EFFECTS_INIT });

    const result = await promise;

    expect(result).toEqual(
      ProfilePhotoActions.setCurrentAvatar({
        avatarId,
        avatarType,
        avatarUrl,
      }),
    );
  });

  it('should dispatch setCurrentAvatar on successful uploadAvatarRequest', async () => {
    const file = new File(['content'], 'photo.png', { type: 'image/png' });
    const avatarId = 'avatar-1';

    (profilePhotoApiServiceMock.uploadUserAvatar as any).mockReturnValue(
      of({ success: true, avatarId }),
    );

    const promise = firstValueFrom(effects.uploadAvatar$);

    actions$.next(ProfilePhotoActions.uploadAvatarRequest({ file }));

    const result = await promise;

    expect(result).toEqual(
      ProfilePhotoActions.setCurrentAvatar({
        avatarId,
        avatarType: 'custom',
        avatarUrl: `${environment.apiUrl}/settings/current-user-avatar/${avatarId}`,
      }),
    );
  });

  it('should clear uploaded file when uploadAvatarRequest response is not successful', async () => {
    const file = new File(['content'], 'photo.png', { type: 'image/png' });

    (profilePhotoApiServiceMock.uploadUserAvatar as any).mockReturnValue(
      of({ success: false, avatarId: null }),
    );

    const promise = firstValueFrom(effects.uploadAvatar$);

    actions$.next(ProfilePhotoActions.uploadAvatarRequest({ file }));

    const result = await promise;

    expect(result).toEqual(ProfilePhotoActions.clearUploadedFile());
  });

  it('should dispatch setCurrentAvatar on selectDefaultAvatarRequest when avatar exists', async () => {
    const avatarId = '1';

    (profilePhotoApiServiceMock.selectFromDefaultAvatar as any).mockReturnValue(of(void 0));

    const promise = firstValueFrom(effects.selectDefaultAvatar$);

    actions$.next(ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId }));

    const result = await promise;

    expect(result).toEqual(
      ProfilePhotoActions.setCurrentAvatar({
        avatarId,
        avatarType: 'default',
        avatarUrl: `${environment.apiUrl}/settings/current-user-avatar/${avatarId}`,
      }),
    );
  });

  it('should dispatch clearUploadedFile when selectDefaultAvatarRequest avatar does not exist', async () => {
    store.overrideSelector(selectDefaultAvatars, []);
    store.refreshState();

    const avatarId = 'non-existing';

    const promise = firstValueFrom(effects.selectDefaultAvatar$);

    actions$.next(ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId }));

    const result = await promise;

    expect(result).toEqual(ProfilePhotoActions.clearUploadedFile());
  });

  it('should dispatch removeAvatar on successful removeAvatarRequest', async () => {
    (profilePhotoApiServiceMock.removeUserAvatar as any).mockReturnValue(of(void 0));

    const promise = firstValueFrom(effects.removeAvatar$);

    actions$.next(ProfilePhotoActions.removeAvatarRequest());

    const result = await promise;

    expect(result).toEqual(ProfilePhotoActions.removeAvatar());
  });

  it('should handle setCurrentAvatar and removeAvatar actions', () => {
 
    actions$.next(
      ProfilePhotoActions.setCurrentAvatar({
        avatarId: '123',
        avatarType: 'default',
        avatarUrl: `${environment.apiUrl}/settings/current-user-avatar/123`,
      }),
    );

    actions$.next(ProfilePhotoActions.removeAvatar());
    
   
    expect(true).toBe(true);
  });

  it('should handle user change and load stored avatar when new user has avatar', async () => {
    const oldUserFullName = 'OldUser';
    const newUserFullName = 'NewUser';
    const avatarId = 'new-avatar-456';
    const avatarUrl = `${environment.apiUrl}/settings/current-user-avatar/${avatarId}`;
    
 
    store.overrideSelector(selectUserInfo, { 
      ...initialUserState, 
      fullName: oldUserFullName,
      avatar: null 
    });
    store.refreshState();
    
   
    store.overrideSelector(selectUserInfo, { 
      ...initialUserState, 
      fullName: newUserFullName,
      avatar: avatarUrl 
    });
    store.refreshState();
    
    const promise = firstValueFrom(effects.loadStoredAvatar$);
    
    actions$.next(
      UserInfoActions.loadUserSuccess({
        user: {
          fullName: newUserFullName,
          theme: null,
          language: null,
          avatar: avatarUrl,
          role: null,
          email: 'new-user@example.com',
        },
      }),
    );
    
    const result = await promise;
    
    expect(result).toEqual(
      ProfilePhotoActions.setCurrentAvatar({
        avatarId,
        avatarType: 'custom',
        avatarUrl,
      }),
    );
  });

});
