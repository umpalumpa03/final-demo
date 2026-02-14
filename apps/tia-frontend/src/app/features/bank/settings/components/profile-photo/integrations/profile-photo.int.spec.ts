import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { firstValueFrom, take, timeout } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { ProfilePhotoContainer } from '../container/profile-photo-container';
import { profilePhotoFeature } from '../store/profile-photo/profile-photo.reducer';
import { userInfoFeature } from '../../../../../../store/user-info/user-info.reducer';
import { personalInfoFeature } from '../../../../../../store/personal-info/personal-info.reducer';
import { ProfilePhotoActions } from '../store/profile-photo/profile-photo.actions';
import * as ProfilePhotoSelectors from '../store/profile-photo/profile-photo.selectors';
import { AlertService } from '@tia/core/services/alert/alert.service';

describe('ProfilePhotoContainer integration', () => {
  let fixture: ComponentFixture<ProfilePhotoContainer>;
  let httpMock: HttpTestingController;
  let store: Store;
  let router: Router;

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
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should update state when loading default avatars', async () => {
    const mockAvatars = [
      { id: 'avatar1', imageUrl: 'https://example.com/avatar1.png' },
      { id: 'avatar2', imageUrl: 'https://example.com/avatar2.png' },
    ];

    store.dispatch(ProfilePhotoActions.loadDefaultAvatars({ avatars: mockAvatars }));

    const avatars = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectDefaultAvatars)
        .pipe(take(1), timeout(1000))
    );

    expect(Array.isArray(avatars)).toBe(true);
    expect(avatars.length).toBe(2);
  });

  it('should update state when setting current avatar', async () => {
    store.dispatch(ProfilePhotoActions.setCurrentAvatar({
      avatarId: 'custom-avatar-123',
      avatarType: 'custom',
      avatarUrl: 'https://example.com/avatar.png',
    }));

    const state = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectProfilePhotoFeatureState)
        .pipe(take(1), timeout(1000))
    );

    expect(state).toBeTruthy();
    if (state) {
      expect(state.avatarId).toBe('custom-avatar-123');
      expect(state.avatarType).toBe('custom');
    }
  });

  it('should update state when selecting default avatar', async () => {
    store.dispatch(ProfilePhotoActions.selectDefaultAvatar({
      avatarId: 'avatar1',
      imageUrl: 'https://example.com/avatar1.png',
    }));

    const state = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectProfilePhotoFeatureState)
        .pipe(take(1), timeout(1000))
    );

    expect(state).toBeTruthy();
    if (state) {
      expect(state.selectedAvatarId).toBe('avatar1');
    }
  });

  it('should clear avatar when removing', async () => {
    store.dispatch(ProfilePhotoActions.setCurrentAvatar({
      avatarId: 'avatar-123',
      avatarType: 'custom',
      avatarUrl: 'https://example.com/avatar.png',
    }));

    store.dispatch(ProfilePhotoActions.removeAvatar());

    const state = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectProfilePhotoFeatureState)
        .pipe(take(1), timeout(1000))
    );

    expect(state).toBeTruthy();
    if (state) {
      expect(state.avatarId).toBeNull();
      expect(state.avatarType).toBeNull();
    }
  });

  it('should update loading state', async () => {
    store.dispatch(ProfilePhotoActions.loadDefaultAvatarsRequest({}));

    const state = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectProfilePhotoFeatureState)
        .pipe(take(1), timeout(1000))
    );

    expect(state).toBeTruthy();
    if (state) {
      expect(state.defaultAvatarsLoading).toBe(true);
    }

    store.dispatch(ProfilePhotoActions.loadDefaultAvatars({ avatars: [] }));

    const stateAfter = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectProfilePhotoFeatureState)
        .pipe(take(1), timeout(1000))
    );

    expect(stateAfter).toBeTruthy();
    if (stateAfter) {
      expect(stateAfter.defaultAvatarsLoading).toBe(false);
    }
  });

  it('should handle error state', async () => {
    const errorMessage = 'Failed to load avatars';

    store.dispatch(ProfilePhotoActions.loadDefaultAvatarsFailure({ error: errorMessage }));

    const state = await firstValueFrom(
      store
        .select(ProfilePhotoSelectors.selectProfilePhotoFeatureState)
        .pipe(take(1), timeout(1000))
    );

    expect(state).toBeTruthy();
    if (state) {
      expect(state.defaultAvatarsError).toBe(errorMessage);
    }
  });
});
