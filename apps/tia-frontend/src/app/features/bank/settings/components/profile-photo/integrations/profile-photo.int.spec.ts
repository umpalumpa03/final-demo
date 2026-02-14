import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { firstValueFrom, filter, take, timeout } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { ProfilePhotoContainer } from '../container/profile-photo-container';
import { ProfilePhotoEffects } from '../store/profile-photo/profile-photo.effects';
import { profilePhotoFeature } from '../store/profile-photo/profile-photo.reducer';
import { userInfoFeature } from '../../../../../../store/user-info/user-info.reducer';
import { personalInfoFeature } from '../../../../../../store/personal-info/personal-info.reducer';
import { ProfilePhotoActions } from '../store/profile-photo/profile-photo.actions';
import * as ProfilePhotoSelectors from '../store/profile-photo/profile-photo.selectors';
import { DefaultAvatarWithUrl } from '../store/profile-photo/profile-photo.state';
import { environment } from '../../../../../../../environments/environment';
import { AlertService } from '@tia/core/services/alert/alert.service';

describe('ProfilePhotoContainer integration', () => {
  let fixture: ComponentFixture<ProfilePhotoContainer>;
  let httpMock: HttpTestingController;
  let store: Store;
  let router: Router;
  let alertService: AlertService;

  const mockAlertService = {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    clearAlert: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePhotoContainer],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideStore({
          ProfilePhoto: profilePhotoFeature.reducer,
          'user-info': userInfoFeature.reducer,
          personalInfo: personalInfoFeature.reducer,
        }),
        provideEffects([ProfilePhotoEffects]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AlertService,
          useValue: mockAlertService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePhotoContainer);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    alertService = TestBed.inject(AlertService);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should load default avatars on init', async () => {
    fixture.detectChanges();

    const mockAvatars = [
      { id: 'avatar1', iconUri: '/icons/avatar1.png' },
      { id: 'avatar2', iconUri: '/icons/avatar2.png' },
    ];

    const req = httpMock.expectOne(
      `${environment.apiUrl}/settings/get-available-default-avatars`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockAvatars);
    fixture.detectChanges();
    await fixture.whenStable();

    const avatars = (await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectDefaultAvatars)
        .pipe(take(1), timeout(5000))
    )) as DefaultAvatarWithUrl[];

    expect(avatars).toHaveLength(2);
    expect(avatars[0].id).toBe('avatar1');
    expect(avatars[0].imageUrl).toBe(`${environment.apiUrl}/icons/avatar1.png`);

    const loading = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectDefaultAvatarsLoading)
        .pipe(take(1), timeout(5000))
    );
    expect(loading).toBe(false);
  });

  it('should upload avatar file successfully', async () => {
    fixture.detectChanges();

    const initReq = httpMock.expectOne(
      `${environment.apiUrl}/settings/get-available-default-avatars`
    );
    initReq.flush([]);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse = { success: true, avatarId: 'custom-avatar-123' };

    store.dispatch(ProfilePhotoActions.uploadAvatarRequest({ file }));

    const uploadReq = httpMock.expectOne(
      `${environment.apiUrl}/settings/upload-user-avatar`
    );

    expect(uploadReq.request.method).toBe('POST');
    expect(uploadReq.request.body instanceof FormData).toBe(true);

    uploadReq.flush(mockResponse);
    fixture.detectChanges();
    await fixture.whenStable();

    const avatarId = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectAvatarId)
        .pipe(
          filter((id) => id !== null),
          take(1),
          timeout(5000)
        )
    );

    expect(avatarId).toBe('custom-avatar-123');

    const avatarType = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectAvatarType)
        .pipe(take(1), timeout(5000))
    );
    expect(avatarType).toBe('custom');
  });

  it('should select default avatar successfully', async () => {
    fixture.detectChanges();

    const initReq = httpMock.expectOne(
      `${environment.apiUrl}/settings/get-available-default-avatars`
    );
    initReq.flush([{ id: 'avatar1', iconUri: '/icons/avatar1.png' }]);

    fixture.detectChanges();
    await fixture.whenStable();

    store.dispatch(ProfilePhotoActions.selectDefaultAvatarRequest({ avatarId: 'avatar1' }));

    const selectReq = httpMock.expectOne(
      `${environment.apiUrl}/settings/select-from-default-avatar`
    );

    expect(selectReq.request.method).toBe('PUT');
    expect(selectReq.request.body).toEqual({ avatarId: 'avatar1' });

    selectReq.flush(null);
    fixture.detectChanges();
    await fixture.whenStable();

    const avatarId = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectAvatarId)
        .pipe(
          filter((id) => id !== null),
          take(1),
          timeout(5000)
        )
    );

    expect(avatarId).toBe('avatar1');

    const avatarType = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectAvatarType)
        .pipe(take(1), timeout(5000))
    );
    expect(avatarType).toBe('default');
  });

  it('should remove avatar successfully', async () => {
    fixture.detectChanges();

    const initReq = httpMock.expectOne(
      `${environment.apiUrl}/settings/get-available-default-avatars`
    );
    initReq.flush([]);

    store.dispatch(ProfilePhotoActions.setCurrentAvatar({
      avatarId: 'avatar-123',
      avatarType: 'custom',
      avatarUrl: `${environment.apiUrl}/settings/current-user-avatar/avatar-123`,
    }));

    fixture.detectChanges();
    await fixture.whenStable();

    store.dispatch(ProfilePhotoActions.removeAvatarRequest());

    const removeReq = httpMock.expectOne(
      `${environment.apiUrl}/settings/remove-user-avatar`
    );

    expect(removeReq.request.method).toBe('DELETE');

    removeReq.flush(null);
    fixture.detectChanges();
    await fixture.whenStable();

    const avatarId = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectAvatarId)
        .pipe(take(1), timeout(5000))
    );

    expect(avatarId).toBeNull();
  });

  it('should handle error when loading default avatars fails', async () => {
    fixture.detectChanges();

    const errorMessage = 'Failed to load avatars';

    const req = httpMock.expectOne(
      `${environment.apiUrl}/settings/get-available-default-avatars`
    );

    req.flush(
      { message: errorMessage },
      { status: 500, statusText: 'Internal Server Error' }
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const error = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectDefaultAvatarsError)
        .pipe(
          filter((err) => err !== null),
          take(1),
          timeout(5000)
        )
    );

    expect(error).toBeTruthy();

    const avatars = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectDefaultAvatars)
        .pipe(take(1), timeout(5000))
    );
    expect(avatars).toEqual([]);
  });
});
