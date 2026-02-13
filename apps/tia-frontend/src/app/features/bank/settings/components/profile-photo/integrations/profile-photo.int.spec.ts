import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../../../../../environments/environment';
import { ProfilePhotoEffects } from '../store/profile-photo/profile-photo.effects';
import { profilePhotoFeature } from '../store/profile-photo/profile-photo.reducer';
import { ProfilePhotoActions } from '../store/profile-photo/profile-photo.actions';
import * as ProfilePhotoSelectors from '../store/profile-photo/profile-photo.selectors';
import { firstValueFrom, filter, take, timeout } from 'rxjs';

describe('Profile Photo Integration', () => {
  let store: Store;
  let httpMock: HttpTestingController;
  const settingsApiUrl = `${environment.apiUrl}/settings`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideStore({ ProfilePhoto: profilePhotoFeature.reducer }),
        provideEffects(ProfilePhotoEffects),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load default avatars successfully', async () => {

    await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectDefaultAvatars).pipe(take(1)),
    );

    store.dispatch(ProfilePhotoActions.loadDefaultAvatarsRequest({ forceRefresh: true }));

    const req = httpMock.expectOne(
      `${settingsApiUrl}/get-available-default-avatars`,
    );
    expect(req.request.method).toBe('GET');

    const apiResponse = [{ id: '1', iconUri: '/avatar-1.svg' }];
    req.flush(apiResponse);

    const avatars = await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectDefaultAvatars).pipe(
        filter((list: any) => Array.isArray(list) && list.length > 0),
        take(1),
        timeout(5000),
      ),
    );

    expect(avatars).toEqual([
      { id: '1', imageUrl: `${environment.apiUrl}/avatar-1.svg` },
    ]);
  });

  it('should select default avatar and update current avatar url', async () => {
    const avatarId = 'avatar-1';

  
    await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectDefaultAvatars).pipe(take(1)),
    );

    store.dispatch(
      ProfilePhotoActions.loadDefaultAvatars({
        avatars: [{ id: avatarId, imageUrl: `${environment.apiUrl}/a-1.svg` }],
      }),
    );

 
    await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectDefaultAvatars).pipe(
        filter((avatars: any) => Array.isArray(avatars) && avatars.length > 0),
        take(1),
        timeout(5000),
      ),
    );

    store.dispatch(
      ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId }),
    );

    const req = httpMock.expectOne(
      `${settingsApiUrl}/select-from-default-avatar`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ avatarId });

    req.flush({});

    const currentAvatarUrl = await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectCurrentAvatarUrl).pipe(
        filter((url): url is string => !!url),
        take(1),
        timeout(5000),
      ),
    );

    expect(currentAvatarUrl).toBe(
      `${settingsApiUrl}/current-user-avatar/${avatarId}`,
    );
  });

  it('should upload custom avatar and set current avatar url', async () => {
    const file = new File(['content'], 'photo.png', { type: 'image/png' });

    store.dispatch(ProfilePhotoActions.uploadAvatarRequest({ file }));

    const req = httpMock.expectOne(
      `${settingsApiUrl}/upload-user-avatar`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);

    req.flush({ success: true, avatarId: 'custom-1' });

    const currentAvatarUrl = await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectCurrentAvatarUrl).pipe(
        filter((url): url is string => !!url),
        take(1),
        timeout(10000),
      ),
    );

    expect(currentAvatarUrl).toBe(
      `${settingsApiUrl}/current-user-avatar/custom-1`,
    );
  });

  it('should remove avatar and clear current avatar url', async () => {
    store.dispatch(
      ProfilePhotoActions.setCurrentAvatar({
        avatarId: 'avatar-1',
        avatarType: 'custom',
        avatarUrl: `${settingsApiUrl}/current-user-avatar/avatar-1`,
      }),
    );

    store.dispatch(ProfilePhotoActions.removeAvatarRequest());

    const req = httpMock.expectOne(
      `${settingsApiUrl}/remove-user-avatar`,
    );
    expect(req.request.method).toBe('DELETE');

    req.flush({});

    const currentAvatarUrl = await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectCurrentAvatarUrl).pipe(
        take(1),
        timeout(5000),
      ),
    );

    expect(currentAvatarUrl).toBeNull();
  });

  it('should clear uploaded file when upload avatar fails', async () => {
    const file = new File(['content'], 'temp.png', { type: 'image/png' });

 
    store.dispatch(
      ProfilePhotoActions.uploadFile({
        fileName: 'temp.png',
        objectUrl: 'blob:http://localhost/temp',
      }),
    );

 
    const initialFileName = await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectUploadedFileName).pipe(
        take(1),
        timeout(5000),
      ),
    );
    expect(initialFileName).toBe('temp.png');

    store.dispatch(ProfilePhotoActions.uploadAvatarRequest({ file }));

    const req = httpMock.expectOne(
      `${settingsApiUrl}/upload-user-avatar`,
    );
    expect(req.request.method).toBe('POST');

    req.flush(
      { message: 'error' },
      { status: 500, statusText: 'Server Error' },
    );

    const uploadedFileName = await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectUploadedFileName).pipe(
        filter((fileName) => fileName === null),
        take(1),
        timeout(10000),
      ),
    );

    expect(uploadedFileName).toBeNull();
  });

  it('should not call API when selecting default avatar that does not exist', async () => {
    store.dispatch(
      ProfilePhotoActions.loadDefaultAvatars({
        avatars: [],
      }),
    );

    store.dispatch(
      ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId: 'missing' }),
    );

    httpMock.expectNone(
      `${settingsApiUrl}/select-from-default-avatar`,
    );

    const currentAvatarUrl = await firstValueFrom(
      store.select(ProfilePhotoSelectors.selectCurrentAvatarUrl).pipe(
        take(1),
        timeout(5000),
      ),
    );

    expect(currentAvatarUrl).toBeNull();
  });
});
