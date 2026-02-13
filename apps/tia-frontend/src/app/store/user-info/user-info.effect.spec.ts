import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { UserInfoService } from '@tia/shared/services/user-info/user-info.service';
import { UserInfoActions } from './user-info.actions';
import { Action } from '@ngrx/store';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { UserInfoEffects } from './user-info.effect';
import { IUserInfo } from '@tia/shared/models/user-info/user-info.models';
import { WidgetsApiService } from '../../shared/services/user-info/widgets-service.api';
import { BirthdayApiService } from '../../features/birthday/services/birthday.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectWidgetsLoaded } from './user-info.selectors';

describe('UserInfoEffects (Vitest)', () => {
  let actions$: Observable<Action>;
  let effects: UserInfoEffects;
  let store: MockStore;
  let userInfoService: any;
  let widgetsApiService: any;
  let birthdayApiService: any;

  const mockUser: IUserInfo = {
    email: 'john@pork.com',
    fullName: 'John Doe',
    theme: 'dark',
    language: 'georgian',
    avatar: null,
    role: 'CONSUMER',
  };

  beforeEach(() => {
    userInfoService = { 
      getUserInfo: vi.fn(),
      updateOnboardingStatus: vi.fn()
    };

    widgetsApiService = {
      getWidgets: vi.fn(),
      createWidget: vi.fn(),
      updateWidget: vi.fn(),
      deleteWidget: vi.fn(),
    };

    birthdayApiService = {
      dismissBirthdayModal: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        UserInfoEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [{ selector: selectWidgetsLoaded, value: false }],
        }),
        { provide: UserInfoService, useValue: userInfoService },
        { provide: WidgetsApiService, useValue: widgetsApiService },
        { provide: BirthdayApiService, useValue: birthdayApiService },
      ],
    });

    effects = TestBed.inject(UserInfoEffects);
    store = TestBed.inject(MockStore);
    vi.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('loadUser$', () => {
    it('should dispatch loadUserSuccess and map georgian to "ka"', async () => {
      userInfoService.getUserInfo.mockReturnValue(of(mockUser));
      actions$ = of(UserInfoActions.loadUser());
      const action = await firstValueFrom(effects.loadUser$);
      expect(action).toEqual(UserInfoActions.loadUserSuccess({ user: mockUser }));
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'ka');
    });

    it('should handle errors during user load', async () => {
      userInfoService.getUserInfo.mockReturnValue(throwError(() => ({ message: 'Error' })));
      actions$ = of(UserInfoActions.loadUser());
      const action = await firstValueFrom(effects.loadUser$);
      expect(action.type).toBe(UserInfoActions.loadUserError.type);
    });
  });

  describe('updateOnboarding$', () => {
    it('should dispatch updateOnboardingStatusSuccess', async () => {
      userInfoService.updateOnboardingStatus.mockReturnValue(of({}));
      actions$ = of(UserInfoActions.updateOnboardingStatus({ completed: true }));
      const action = await firstValueFrom(effects.updateOnboarding$);
      expect(action).toEqual(UserInfoActions.updateOnboardingStatusSuccess({ completed: true }));
    });
  });

  describe('dismissBirthdayModal$', () => {
    it('should dispatch loadBirthdayModalClosed', async () => {
      birthdayApiService.dismissBirthdayModal.mockReturnValue(of({}));
      actions$ = of(UserInfoActions.dismissBirthdayModal({ year: 2025 }));
      const action = await firstValueFrom(effects.dismissBirthdayModal$);
      expect(action).toEqual(UserInfoActions.loadBirthdayModalClosed({ colsedBirthdayModal: 2025 }));
    });
  });

  describe('loadWidgets$', () => {
    it('should load widgets when not loaded', async () => {
      const mockWidgets = [{ id: '1' }] as any;
      widgetsApiService.getWidgets.mockReturnValue(of(mockWidgets));
      actions$ = of(UserInfoActions.loadWidgets({ force: false }));
      const action = await firstValueFrom(effects.loadWidgets$);
      expect(action).toEqual(UserInfoActions.loadWidgetsSuccess({ widgets: mockWidgets }));
    });
  });

  describe('deleteWidget$', () => {
    it('should dispatch deleteWidgetSuccess', async () => {
      widgetsApiService.deleteWidget.mockReturnValue(of({}));
      actions$ = of(UserInfoActions.deleteWidget({ id: '1' }));
      const action = await firstValueFrom(effects.deleteWidget$);
      expect(action).toEqual(UserInfoActions.deleteWidgetSuccess({ id: '1' }));
    });
  });
});