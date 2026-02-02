import { inject, Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { ProfilePhotoActions } from './profile-photo.actions';
import { ProfilePhotoService } from '../../shared/services/profile-photo-api/profile-photo.service';
import { Store } from '@ngrx/store';
import { catchError, concat, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { selectDefaultAvatars } from './profile-photo.selectors';
import { selectUserInfo } from '../user-info/user-info.selectors';
import { UserInfoActions } from '../user-info/user-info.actions';

@Injectable()
export class ProfilePhotoEffects {
  private actions$ = inject(Actions);
  private profilePhotoService = inject(ProfilePhotoService);
  private store = inject(Store);

  private getUserIdentifier(): string | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user?.fullName || null;
      }
    } catch {
    }
    return null;
  }

  private getAvatarStorageKeys(userFullName: string | null): { avatarIdKey: string; avatarTypeKey: string } {
    if (userFullName) {
      return {
        avatarIdKey: `avatarId_${userFullName}`,
        avatarTypeKey: `avatarType_${userFullName}`,
      };
    }
    return {
      avatarIdKey: 'avatarId',
      avatarTypeKey: 'avatarType',
    };
  }

  public initLoadDefaultAvatars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => ProfilePhotoActions.loadDefaultAvatarsRequest()),
    ),
  );

  public loadDefaultAvatars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfilePhotoActions.loadDefaultAvatarsRequest),
      switchMap(() =>
        this.profilePhotoService.getAvailableDefaultAvatars().pipe(
          map((avatars) =>
            ProfilePhotoActions.loadDefaultAvatars({ avatars }),
          ),
          catchError((error) => {
            return concat(
              of(ProfilePhotoActions.loadDefaultAvatars({ avatars: [] })),
              of(ProfilePhotoActions.loadDefaultAvatarsFailure({ 
                error: error.message || 'Failed to load default avatars' 
              })),
            );
          }),
        ),
      ),
    ),
  );

  public loadStoredAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT, ProfilePhotoActions.loadStoredAvatar, UserInfoActions.loadUserSuccess),
      withLatestFrom(this.store.select(selectUserInfo)),
      map(([, userInfo]) => {
        let userFullName = userInfo?.fullName;
        if (!userFullName) {
          userFullName = this.getUserIdentifier();
        }
        if (!userFullName) {
          return null;
        }
        const { avatarIdKey, avatarTypeKey } = this.getAvatarStorageKeys(userFullName);
        const storedAvatarId = localStorage.getItem(avatarIdKey);
        const storedAvatarType = localStorage.getItem(avatarTypeKey) as 'default' | 'custom' | null;
        if (storedAvatarId && storedAvatarType && (storedAvatarType === 'default' || storedAvatarType === 'custom')) {
          const avatarUrl = `${environment.apiUrl}/settings/current-user-avatar/${storedAvatarId}`;
          return ProfilePhotoActions.setCurrentAvatar({
            avatarId: storedAvatarId,
            avatarType: storedAvatarType,
            avatarUrl,
          });
        }
        return null;
      }),
      filter((action): action is ReturnType<typeof ProfilePhotoActions.setCurrentAvatar> => action !== null),
    ),
  );

  public uploadAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfilePhotoActions.uploadAvatarRequest),
      switchMap(({ file }) =>
        this.profilePhotoService.uploadUserAvatar(file).pipe(
          map((result) => {
            if (result.success && result.avatarId) {
              const avatarUrl = `${environment.apiUrl}/settings/current-user-avatar/${result.avatarId}`;
              return ProfilePhotoActions.setCurrentAvatar({
                avatarId: result.avatarId,
                avatarType: 'custom',
                avatarUrl,
              });
            }
            return ProfilePhotoActions.clearUploadedFile();
          }),
          catchError((error) => {
            return concat(
              of(ProfilePhotoActions.clearUploadedFile()),
              of(ProfilePhotoActions.uploadAvatarFailure({ 
                error: error.message || 'Failed to upload avatar' 
              })),
            );
          }),
        ),
      ),
    ),
  );

  public selectDefaultAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfilePhotoActions.selectDefaultAvatarRequest),
      withLatestFrom(this.store.select(selectDefaultAvatars)),
      switchMap(([{ avatarId }, avatars]) => {
        const avatar = avatars.find((a) => a.id === avatarId);
        if (!avatar) {
          return of(ProfilePhotoActions.clearUploadedFile());
        }
        return this.profilePhotoService.selectFromDefaultAvatar(avatarId).pipe(
          map(() => {
            const avatarUrl = `${environment.apiUrl}/settings/current-user-avatar/${avatarId}`;
            return ProfilePhotoActions.setCurrentAvatar({
              avatarId,
              avatarType: 'default',
              avatarUrl,
            });
          }),
          catchError((error) => {
            return concat(
              of(ProfilePhotoActions.clearUploadedFile()),
              of(ProfilePhotoActions.selectDefaultAvatarFailure({ 
                error: error.message || 'Failed to select default avatar' 
              })),
            );
          }),
        );
      }),
    ),
  );

  public removeAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfilePhotoActions.removeAvatarRequest),
      switchMap(() =>
        this.profilePhotoService.removeUserAvatar().pipe(
          map(() => ProfilePhotoActions.removeAvatar()),
          catchError((error) => {
            return concat(
              of(ProfilePhotoActions.clearUploadedFile()),
              of(ProfilePhotoActions.removeAvatarFailure({ 
                error: error.message || 'Failed to remove avatar' 
              })),
            );
          }),
        ),
      ),
    ),
  );

  public syncLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ProfilePhotoActions.setCurrentAvatar,
          ProfilePhotoActions.removeAvatar,
        ),
        withLatestFrom(this.store.select(selectUserInfo)),
        tap(([action, userInfo]) => {
          let userFullName = userInfo?.fullName;
          if (!userFullName) {
            userFullName = this.getUserIdentifier();
          }
          if (!userFullName) {
            return;
          }
          const { avatarIdKey, avatarTypeKey } = this.getAvatarStorageKeys(userFullName);
          if (action.type === ProfilePhotoActions.setCurrentAvatar.type) {
            localStorage.setItem(avatarIdKey, action.avatarId);
            localStorage.setItem(avatarTypeKey, action.avatarType);
          } else if (action.type === ProfilePhotoActions.removeAvatar.type) {
            localStorage.removeItem(avatarIdKey);
            localStorage.removeItem(avatarTypeKey);
          }
        }),
      ),
    { dispatch: false },
  );

  public clearAvatarOnUserChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserInfoActions.loadUserSuccess),
        withLatestFrom(this.store.select(selectUserInfo)),
        tap(([{ user: newUser }, previousUserInfo]) => {
          if (previousUserInfo?.fullName && previousUserInfo.fullName !== newUser.fullName) {
            const oldKeys = this.getAvatarStorageKeys(previousUserInfo.fullName);
            localStorage.removeItem(oldKeys.avatarIdKey);
            localStorage.removeItem(oldKeys.avatarTypeKey);
          }
        }),
      ),
    { dispatch: false },
  );
}
