import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject, firstValueFrom, of } from 'rxjs';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { ProfilePhotoEffects } from './profile-photo.effects';
import { ProfilePhotoService } from '../../shared/services/profile-photo-api/profile-photo.service';
import { ProfilePhotoActions } from './profile-photo.actions';
import { selectDefaultAvatars } from './profile-photo.selectors';
import { DefaultAvatarResponse } from './profile-photo.state';
import { environment } from '../../../environments/environment';

describe('ProfilePhotoEffects', () => {
  let actions$: Subject<any>;
  let effects: ProfilePhotoEffects;
  let profilePhotoServiceMock: ProfilePhotoService;
  let store: MockStore;

  beforeEach(() => {
    actions$ = new Subject<any>();

    profilePhotoServiceMock = {
      getAvailableDefaultAvatars: vi.fn(),
      selectFromDefaultAvatar: vi.fn(),
      uploadUserAvatar: vi.fn(),
      removeUserAvatar: vi.fn(),
    } as unknown as ProfilePhotoService;

    TestBed.configureTestingModule({
      providers: [
        ProfilePhotoEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectDefaultAvatars,
              value: [{ id: '1', iconUri: '/avatar-1.svg' }] as DefaultAvatarResponse[],
            },
          ],
        }),
        { provide: ProfilePhotoService, useValue: profilePhotoServiceMock },
      ],
    });

    effects = TestBed.inject(ProfilePhotoEffects);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadDefaultAvatarsRequest on ROOT_EFFECTS_INIT', async () => {
    const promise = firstValueFrom(effects.initLoadDefaultAvatars$);

    actions$.next({ type: ROOT_EFFECTS_INIT });

    const result = await promise;

    expect(result).toEqual(ProfilePhotoActions.loadDefaultAvatarsRequest());
  });

  it('should load default avatars on loadDefaultAvatarsRequest', async () => {
    const avatars: DefaultAvatarResponse[] = [
      { id: '1', iconUri: '/avatar-1.svg' },
    ];

    (profilePhotoServiceMock.getAvailableDefaultAvatars as any).mockReturnValue(of(avatars));

    const promise = firstValueFrom(effects.loadDefaultAvatars$);

    actions$.next(ProfilePhotoActions.loadDefaultAvatarsRequest());

    const result = await promise;

    expect(result).toEqual(ProfilePhotoActions.loadDefaultAvatars({ avatars }));
  });

  it('should load stored avatar on ROOT_EFFECTS_INIT when localStorage has data', async () => {
    const avatarId = '123';
    const avatarType: 'default' | 'custom' = 'default';
    localStorage.setItem('avatarId', avatarId);
    localStorage.setItem('avatarType', avatarType);

    const promise = firstValueFrom(effects.loadStoredAvatar$);

    actions$.next({ type: ROOT_EFFECTS_INIT });

    const result = await promise;

    expect(result).toEqual(
      ProfilePhotoActions.setCurrentAvatar({
        avatarId,
        avatarType,
        avatarUrl: `${environment.apiUrl}/settings/current-user-avatar/${avatarId}`,
      }),
    );
  });

  it('should dispatch setCurrentAvatar on successful uploadAvatarRequest', async () => {
    const file = new File(['content'], 'photo.png', { type: 'image/png' });
    const avatarId = 'avatar-1';

    (profilePhotoServiceMock.uploadUserAvatar as any).mockReturnValue(
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

    (profilePhotoServiceMock.uploadUserAvatar as any).mockReturnValue(
      of({ success: false, avatarId: null }),
    );

    const promise = firstValueFrom(effects.uploadAvatar$);

    actions$.next(ProfilePhotoActions.uploadAvatarRequest({ file }));

    const result = await promise;

    expect(result).toEqual(ProfilePhotoActions.clearUploadedFile());
  });

  it('should dispatch setCurrentAvatar on selectDefaultAvatarRequest when avatar exists', async () => {
    const avatarId = '1';

    (profilePhotoServiceMock.selectFromDefaultAvatar as any).mockReturnValue(of(void 0));

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
    (profilePhotoServiceMock.removeUserAvatar as any).mockReturnValue(of(void 0));

    const promise = firstValueFrom(effects.removeAvatar$);

    actions$.next(ProfilePhotoActions.removeAvatarRequest());

    const result = await promise;

    expect(result).toEqual(ProfilePhotoActions.removeAvatar());
  });

  it('should execute syncLocalStorage effect without errors', () => {
    effects.syncLocalStorage$.subscribe();

    actions$.next(
      ProfilePhotoActions.setCurrentAvatar({
        avatarId: '123',
        avatarType: 'default',
        avatarUrl: `${environment.apiUrl}/settings/current-user-avatar/123`,
      }),
    );

    actions$.next(ProfilePhotoActions.removeAvatar());
  });

});
