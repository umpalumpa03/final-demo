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
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectWidgetsLoaded } from './user-info.selectors';

describe('UserInfoEffects (Vitest)', () => {
  let actions$: Observable<Action>;
  let effects: UserInfoEffects;
  let store: MockStore;
  let userInfoService: { getUserInfo: any };
  let widgetsApiService: {
    getWidgets: any;
    createWidget: any;
    updateWidget: any;
    deleteWidget: any;
  };

  const mockUser: IUserInfo = {
    email: 'john pork',
    fullName: 'John Doe',
    theme: 'dark',
    language: 'georgian',
    avatar: null,
    role: 'CONSUMER',
  };

  beforeEach(() => {
    userInfoService = { getUserInfo: vi.fn() };

    widgetsApiService = {
      getWidgets: vi.fn(),
      createWidget: vi.fn(),
      updateWidget: vi.fn(),
      deleteWidget: vi.fn(),
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
    it('should dispatch loadUserSuccess and map georgian to "ka" in localStorage', async () => {
      userInfoService.getUserInfo.mockReturnValue(of(mockUser));
      actions$ = of(UserInfoActions.loadUser());

      const action = await firstValueFrom(effects.loadUser$);
      expect(action).toEqual(
        UserInfoActions.loadUserSuccess({ user: mockUser }),
      );
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'ka');
    });

    it('should handle errors during user load', async () => {
      userInfoService.getUserInfo.mockReturnValue(
        throwError(() => ({ message: 'API Error' })),
      );
      actions$ = of(UserInfoActions.loadUser());

      const action = await firstValueFrom(effects.loadUser$);
      expect(action).toEqual(
        UserInfoActions.loadUserError({ error: 'API Error' }),
      );
    });
  });

  describe('loadWidgets$', () => {
    it('should load widgets when they are not already loaded', async () => {
      const mockWidgets = [{ id: '1', title: 'Test' }] as any;
      widgetsApiService.getWidgets.mockReturnValue(of(mockWidgets));
      actions$ = of(UserInfoActions.loadWidgets({ force: false }));

      const action = await firstValueFrom(effects.loadWidgets$);
      expect(action).toEqual(
        UserInfoActions.loadWidgetsSuccess({ widgets: mockWidgets }),
      );
    });
  });

  describe('createWidget$', () => {
    it('should trigger force reload of widgets after successful creation', async () => {
      widgetsApiService.createWidget.mockReturnValue(of({}));
      actions$ = of(UserInfoActions.createWidget({ widget: {} as any }));

      const action = await firstValueFrom(effects.createWidget$);
      expect(action).toEqual(UserInfoActions.loadWidgets({ force: true }));
    });
  });

  describe('updateWidgetsBulk$', () => {
    it('should update multiple widgets using forkJoin', async () => {
      const updates = [
        { id: '1', updates: {} },
        { id: '2', updates: {} },
      ];
      widgetsApiService.updateWidget.mockReturnValue(of({}));
      actions$ = of(UserInfoActions.updateWidgetsBulk({ updates }));

      const action = await firstValueFrom(effects.updateWidgetsBulk$);
      expect(action.type).toBe(UserInfoActions.updateWidgetsBulkSuccess.type);
      expect(widgetsApiService.updateWidget).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteWidget$', () => {
    it('should dispatch deleteWidgetSuccess after API call', async () => {
      widgetsApiService.deleteWidget.mockReturnValue(of({}));
      actions$ = of(UserInfoActions.deleteWidget({ id: '1' }));

      const action = await firstValueFrom(effects.deleteWidget$);
      expect(action).toEqual(UserInfoActions.deleteWidgetSuccess({ id: '1' }));
    });
  });
});
