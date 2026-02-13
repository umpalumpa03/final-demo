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
    it('should set language to "ka" when user language is georgian', async () => {
      userInfoService.getUserInfo.mockReturnValue(of(mockUser));
      actions$ = of(UserInfoActions.loadUser());
      await firstValueFrom(effects.loadUser$);
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'ka');
    });

    it('should set language to "en" when user language is NOT georgian', async () => {
      userInfoService.getUserInfo.mockReturnValue(of({ ...mockUser, language: 'english' }));
      actions$ = of(UserInfoActions.loadUser());
      await firstValueFrom(effects.loadUser$);
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
    });

    it('should dispatch loadUserError on API failure', async () => {
      userInfoService.getUserInfo.mockReturnValue(throwError(() => ({ message: 'Failed' })));
      actions$ = of(UserInfoActions.loadUser());
      const action = await firstValueFrom(effects.loadUser$);
      expect(action).toEqual(UserInfoActions.loadUserError({ error: 'Failed' }));
    });
  });

  describe('createWidget$', () => {
    it('should dispatch createWidgetError on failure', async () => {
      widgetsApiService.createWidget.mockReturnValue(throwError(() => ({ message: 'Create Error' })));
      actions$ = of(UserInfoActions.createWidget({ widget: {} as any }));
      const action = await firstValueFrom(effects.createWidget$);
      expect(action).toEqual(UserInfoActions.createWidgetError({ error: 'Create Error' }));
    });
  });

  describe('updateOnboarding$', () => {
    it('should dispatch updateOnboardingStatusError on failure', async () => {
      userInfoService.updateOnboardingStatus.mockReturnValue(throwError(() => ({ message: 'Onboard Error' })));
      actions$ = of(UserInfoActions.updateOnboardingStatus({ completed: true }));
      const action = await firstValueFrom(effects.updateOnboarding$);
      expect(action).toEqual(UserInfoActions.updateOnboardingStatusError({ error: 'Onboard Error' }));
    });
  });

  describe('dismissBirthdayModal$', () => {
    it('should dispatch loadUserError on failure', async () => {
      birthdayApiService.dismissBirthdayModal.mockReturnValue(throwError(() => ({ message: 'Bday Error' })));
      actions$ = of(UserInfoActions.dismissBirthdayModal({ year: 2025 }));
      const action = await firstValueFrom(effects.dismissBirthdayModal$);
      expect(action).toEqual(UserInfoActions.loadUserError({ error: 'Bday Error' }));
    });
  });

  describe('loadWidgets$', () => {
    it('should load widgets and dispatch success', async () => {
      const mockWidgets = [{ id: '1' }] as any;
      widgetsApiService.getWidgets.mockReturnValue(of(mockWidgets));
      actions$ = of(UserInfoActions.loadWidgets({ force: true }));
      const action = await firstValueFrom(effects.loadWidgets$);
      expect(action).toEqual(UserInfoActions.loadWidgetsSuccess({ widgets: mockWidgets }));
    });

    it('should dispatch loadWidgetsError on failure', async () => {
      widgetsApiService.getWidgets.mockReturnValue(throwError(() => ({ message: 'Widgets Error' })));
      actions$ = of(UserInfoActions.loadWidgets({ force: true }));
      const action = await firstValueFrom(effects.loadWidgets$);
      expect(action).toEqual(UserInfoActions.loadWidgetsError({ error: 'Widgets Error' }));
    });
  });
});