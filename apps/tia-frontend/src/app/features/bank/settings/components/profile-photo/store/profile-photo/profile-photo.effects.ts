import { inject, Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { ProfilePhotoActions } from './profile-photo.actions';
import { ProfilePhotoApiService } from '../../../../../../../shared/services/profile-photo/profile-photo.service';
import { Store } from '@ngrx/store';
import { catchError, concat, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { environment } from '../../../../../../../../environments/environment';
import { selectDefaultAvatars } from './profile-photo.selectors';
import { selectUserInfo } from '../../../../../../../store/user-info/user-info.selectors';
import { UserInfoActions } from '../../../../../../../store/user-info/user-info.actions';


@Injectable()
export class ProfilePhotoEffects {
  private actions$ = inject(Actions);
  private profilePhotoApiService = inject(ProfilePhotoApiService);
  private store = inject(Store);

  public initLoadUserInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      withLatestFrom(this.store.select(selectUserInfo)),
      filter(([, userInfo]) => {
      return !userInfo?.fullName && !userInfo?.loading;
      }),
      map(() => UserInfoActions.loadUser()),
    ),
  );

  public loadDefaultAvatars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfilePhotoActions.loadDefaultAvatarsRequest),
      withLatestFrom(this.store.select(selectDefaultAvatars)),
      switchMap(([{ forceRefresh }, avatars]) => {
        const shouldFetch =
          !!forceRefresh || !avatars || avatars.length === 0;

        if (!shouldFetch) {
          return of(ProfilePhotoActions.loadDefaultAvatars({ avatars }));
        }

        return this.profilePhotoApiService.getAvailableDefaultAvatars().pipe(
          map((fetchedAvatars) => {
            const avatarsWithUrls = fetchedAvatars.map(avatar => ({
              id: avatar.id,
              imageUrl: `${environment.apiUrl}${avatar.iconUri}`
            }));
            return ProfilePhotoActions.loadDefaultAvatars({ avatars: avatarsWithUrls });
          }),
          catchError((error) => {
            return concat(
              of(ProfilePhotoActions.loadDefaultAvatars({ avatars: [] })),
              of(
                ProfilePhotoActions.loadDefaultAvatarsFailure({
                  error:
                    error.message || 'Failed to load default avatars',
                }),
              ),
            );
          }),
        );
      }),
    ),
  );

  public loadStoredAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ROOT_EFFECTS_INIT,
        ProfilePhotoActions.loadStoredAvatar,
        UserInfoActions.loadUserSuccess,
        ProfilePhotoActions.loadDefaultAvatars,
      ),
      withLatestFrom(
        this.store.select(selectUserInfo),
        this.store.select(selectDefaultAvatars),
      ),
      filter(([, userInfo]) => {
        return !!userInfo?.avatar;
      }),
      map(([, userInfo, defaultAvatars]) => {
        const avatarFromStore = userInfo!.avatar!;
        let avatarId: string;
        let avatarUrl: string;

        if (avatarFromStore.includes('/current-user-avatar/')) {
          const avatarIdMatch = avatarFromStore.match(/\/current-user-avatar\/([^\/]+)$/);
          if (!avatarIdMatch || !avatarIdMatch[1]) {
            return null;
          }
          avatarId = avatarIdMatch[1];
          avatarUrl = avatarFromStore;
        } else {
          avatarId = avatarFromStore;
          avatarUrl = `${environment.apiUrl}/settings/current-user-avatar/${avatarId}`;
        }

        const isDefaultAvatar = defaultAvatars.length > 0 && defaultAvatars.some(avatar => avatar.id === avatarId);
        const avatarType: 'default' | 'custom' = isDefaultAvatar ? 'default' : 'custom';

        return ProfilePhotoActions.setCurrentAvatar({
          avatarId,
          avatarType,
          avatarUrl,
        });
      }),
      filter((action): action is ReturnType<typeof ProfilePhotoActions.setCurrentAvatar> => action !== null),
    ),
  );

  public uploadAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfilePhotoActions.uploadAvatarRequest),
      switchMap(({ file }) =>
        this.profilePhotoApiService.uploadUserAvatar(file).pipe(
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
        return this.profilePhotoApiService.selectFromDefaultAvatar(avatarId).pipe(
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
        this.profilePhotoApiService.removeUserAvatar().pipe(
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

}
