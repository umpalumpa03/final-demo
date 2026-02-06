import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { UserInfoService } from '@tia/shared/services/user-info/user-info.service';
import { UserInfoActions } from './user-info.actions';
import { Action } from '@ngrx/store';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { UserInfoEffects } from './user-info.effect';
import { IUserInfo } from '@tia/shared/models/user-info/user-info.models';

describe('UserInfoEffects (Vitest)', () => {
  let actions$: Observable<Action>;
  let effects: UserInfoEffects;
  let userInfoService: {
    getUserInfo: ReturnType<typeof vi.fn>;
  };

  const mockUser: IUserInfo = {
    fullName: 'John Doe',
    theme: 'dark',
    language: 'en',
    avatar: null,
    role: 'CONSUMER',
  };

  beforeEach(() => {
    userInfoService = {
      getUserInfo: vi.fn(),
    };

    actions$ = of(UserInfoActions.loadUser());

    TestBed.configureTestingModule({
      providers: [
        UserInfoEffects,
        provideMockActions(() => actions$),
        { provide: UserInfoService, useValue: userInfoService },
      ],
    });

    effects = TestBed.inject(UserInfoEffects);

    vi.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should dispatch loadUserSuccess and write user data to localStorage', async () => {
    userInfoService.getUserInfo.mockReturnValue(of(mockUser));

    const action = await firstValueFrom(effects.loadUser$);
    expect(action).toEqual(
      UserInfoActions.loadUserSuccess({ user: mockUser }),
    );

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'theme',
      mockUser.theme,
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'language',
      mockUser.language,
    );
  });

  it('should dispatch loadUserError when service throws', async () => {
    userInfoService.getUserInfo.mockReturnValue(
      throwError(() => new Error('Boom')),
    );

    const action = await firstValueFrom(effects.loadUser$);
    expect(action).toEqual(
      UserInfoActions.loadUserError({
        error: 'Boom',
      }),
    );
  });

  it('should not write theme or language when missing', async () => {
    const userWithoutPrefs: IUserInfo = {
      fullName: 'Jane Doe',
      theme: null,
      language: null,
      avatar: null,
      role: null,
    };

    userInfoService.getUserInfo.mockReturnValue(
      of(userWithoutPrefs),
    );

    const action = await firstValueFrom(effects.loadUser$);
    expect(action).toEqual(
      UserInfoActions.loadUserSuccess({
        user: userWithoutPrefs,
      }),
    );

    expect(localStorage.setItem).not.toHaveBeenCalledWith(
      'theme',
      expect.anything(),
    );
    expect(localStorage.setItem).not.toHaveBeenCalledWith(
      'language',
      expect.anything(),
    );
  });
});
