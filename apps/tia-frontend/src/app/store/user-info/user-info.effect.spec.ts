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
    birthdayApiService = { dismissBirthdayModal: vi.fn() };

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
    it('should set theme and ka language when user is georgian', async () => {
      userInfoService.getUserInfo.mockReturnValue(of(mockUser));
      actions$ = of(UserInfoActions.loadUser());
      await firstValueFrom(effects.loadUser$);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'ka');
    });

    it('should set en language when user is not georgian', async () => {
      const engUser = { ...mockUser, language: 'english' };
      userInfoService.getUserInfo.mockReturnValue(of(engUser));
      actions$ = of(UserInfoActions.loadUser());
      await firstValueFrom(effects.loadUser$);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
    });

    it('should not set localStorage if theme and language are missing', async () => {
      const emptyUser = { fullName: 'No Prefs' } as any;
      userInfoService.getUserInfo.mockReturnValue(of(emptyUser));
      actions$ = of(UserInfoActions.loadUser());
      await firstValueFrom(effects.loadUser$);
      
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle error with default message', async () => {
      userInfoService.getUserInfo.mockReturnValue(throwError(() => ({ }))); 
      actions$ = of(UserInfoActions.loadUser());
      const action = await firstValueFrom(effects.loadUser$);
      expect(action).toEqual(UserInfoActions.loadUserError({ error: 'error' }));
    });
  });

  describe('loadWidgets$', () => {
    it('should load widgets success', async () => {
      const widgets = [{ id: '1' }] as any;
      widgetsApiService.getWidgets.mockReturnValue(of(widgets));
      actions$ = of(UserInfoActions.loadWidgets({ force: true }));
      const action = await firstValueFrom(effects.loadWidgets$);
      expect(action).toEqual(UserInfoActions.loadWidgetsSuccess({ widgets }));
    });

    it('should handle load widgets error', async () => {
      widgetsApiService.getWidgets.mockReturnValue(throwError(() => ({ message: 'fail' })));
      actions$ = of(UserInfoActions.loadWidgets({ force: true }));
      const action = await firstValueFrom(effects.loadWidgets$);
      expect(action).toEqual(UserInfoActions.loadWidgetsError({ error: 'fail' }));
    });
  });

  describe('updateWidgetsBulk$', () => {
    it('should dispatch success when all updates pass', async () => {
      const updates = [{ id: '1', updates: {} }];
      widgetsApiService.updateWidget.mockReturnValue(of({}));
      actions$ = of(UserInfoActions.updateWidgetsBulk({ updates }));
      const action = await firstValueFrom(effects.updateWidgetsBulk$);
      expect(action.type).toBe(UserInfoActions.updateWidgetsBulkSuccess.type);
    });

    it('should handle bulk update error', async () => {
      widgetsApiService.updateWidget.mockReturnValue(throwError(() => ({ message: 'Bulk Fail' })));
      actions$ = of(UserInfoActions.updateWidgetsBulk({ updates: [{ id: '1', updates: {} }] }));
      const action = await firstValueFrom(effects.updateWidgetsBulk$);
      expect(action).toEqual(UserInfoActions.updateWidgetsBulkError({ error: 'Bulk Fail' }));
    });
  });

  describe('createWidget$', () => {
    it('should handle creation error', async () => {
      widgetsApiService.createWidget.mockReturnValue(throwError(() => ({ message: 'Err' })));
      actions$ = of(UserInfoActions.createWidget({ widget: {} as any }));
      const action = await firstValueFrom(effects.createWidget$);
      expect(action).toEqual(UserInfoActions.createWidgetError({ error: 'Err' }));
    });
  });

  describe('deleteWidget$', () => {
    it('should dispatch success on delete', async () => {
      widgetsApiService.deleteWidget.mockReturnValue(of({}));
      actions$ = of(UserInfoActions.deleteWidget({ id: '1' }));
      const action = await firstValueFrom(effects.deleteWidget$);
      expect(action).toEqual(UserInfoActions.deleteWidgetSuccess({ id: '1' }));
    });

    it('should handle delete error', async () => {
      widgetsApiService.deleteWidget.mockReturnValue(throwError(() => ({ message: 'Del Err' })));
      actions$ = of(UserInfoActions.deleteWidget({ id: '1' }));
      const action = await firstValueFrom(effects.deleteWidget$);
      expect(action).toEqual(UserInfoActions.deleteWidgetError({ error: 'Del Err' }));
    });
  });

  describe('updateOnboarding$', () => {
    it('should handle onboarding error', async () => {
      userInfoService.updateOnboardingStatus.mockReturnValue(throwError(() => ({ message: 'Err' })));
      actions$ = of(UserInfoActions.updateOnboardingStatus({ completed: true }));
      const action = await firstValueFrom(effects.updateOnboarding$);
      expect(action).toEqual(UserInfoActions.updateOnboardingStatusError({ error: 'Err' }));
    });
  });

  describe('dismissBirthdayModal$', () => {
    it('should handle birthday dismiss error', async () => {
      birthdayApiService.dismissBirthdayModal.mockReturnValue(throwError(() => ({ message: 'Bday Err' })));
      actions$ = of(UserInfoActions.dismissBirthdayModal({ year: 2026 }));
      const action = await firstValueFrom(effects.dismissBirthdayModal$);
      expect(action).toEqual(UserInfoActions.loadUserError({ error: 'Bday Err' }));
    });
  });
});