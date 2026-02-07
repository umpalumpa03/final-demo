import { describe, it, expect } from 'vitest';
import { userInfoReducer, initialUserState } from './user-info.reducer';
import { UserInfoActions } from './user-info.actions';

describe('userInfoReducer', () => {
  it('sets loading on loadUser', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUser());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('merges user on loadUserSuccess', () => {
    const user = {
      fullName: 'A',
      email: 'a@example.com',
      theme: 't',
      language: 'l',
      avatar: 'a',
      role: 'r',
    } as any;
    const state = userInfoReducer(
      initialUserState,
      UserInfoActions.loadUserSuccess({ user }),
    );
    expect(state.fullName).toBe('A');
    expect(state.email).toBe('a@example.com');
    expect(state.theme).toBe('t');
    expect(state.language).toBe('l');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets error on loadUserError', () => {
    const state = userInfoReducer(
      initialUserState,
      UserInfoActions.loadUserError({ error: 'err' }),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('err');
  });

  it('sets fullName on loadUserFullname', () => {
    const state = userInfoReducer(
      initialUserState,
      UserInfoActions.loadUserFullname({ fullName: 'John' }),
    );
    expect(state.fullName).toBe('John');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets email on loadUserEmail', () => {
    const state = userInfoReducer(
      initialUserState,
      UserInfoActions.loadUserEmail({ email: 'john@example.com' }),
    );
    expect(state.email).toBe('john@example.com');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets theme on loadUserTheme', () => {
    const state = userInfoReducer(
      initialUserState,
      UserInfoActions.loadUserTheme({ theme: 'dark' }),
    );
    expect(state.theme).toBe('dark');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets language on loadUserLanguage', () => {
    const state = userInfoReducer(
      initialUserState,
      UserInfoActions.loadUserLanguage({ language: 'en' }),
    );
    expect(state.language).toBe('en');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets avatar on loadUserAvatar', () => {
    const state = userInfoReducer(
      initialUserState,
      UserInfoActions.loadUserAvatar({ avatar: 'url' }),
    );
    expect(state.avatar).toBe('url');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets role on loadUserRole', () => {
    const state = userInfoReducer(
      initialUserState,
      UserInfoActions.loadUserRole({ role: 'SUPPORT' }),
    );
    expect(state.role).toBe('SUPPORT');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
  it('removes widget on deleteWidgetSuccess', () => {
    const initialState = {
      ...initialUserState,
      widgets: [{ dbId: '1' }, { dbId: '2' }] as any[],
    };

    const state = userInfoReducer(
      initialState,
      UserInfoActions.deleteWidgetSuccess({ id: '1' }),
    );

    expect(state.widgets.length).toBe(1);
    expect(state.widgets[0].dbId).toBe('2');
    expect(state.widgetsLoading).toBe(false);
  });

  it('sets widgetsLoading to false on any widget error', () => {
    const actions = [
      UserInfoActions.loadWidgetsError({ error: 'fail' }),
      UserInfoActions.createWidgetError({ error: 'fail' }),
      UserInfoActions.updateWidgetsBulkError({ error: 'fail' }),
      UserInfoActions.deleteWidgetError({ error: 'fail' }),
    ];

    actions.forEach((action) => {
      const state = userInfoReducer(
        { ...initialUserState, widgetsLoading: true },
        action,
      );
      expect(state.widgetsLoading).toBe(false);
      expect(state.error).toBe('fail');
    });
  });
  it('sets widgetsLoading on loadWidgets, createWidget, and deleteWidget', () => {
    const state1 = userInfoReducer(
      initialUserState,
      UserInfoActions.loadWidgets({}),
    );
    const state2 = userInfoReducer(
      initialUserState,
      UserInfoActions.createWidget({ widget: {} as any }),
    );
    const state3 = userInfoReducer(
      initialUserState,
      UserInfoActions.deleteWidget({ id: '1' }),
    );

    expect(state1.widgetsLoading).toBe(true);
    expect(state2.widgetsLoading).toBe(true);
    expect(state3.widgetsLoading).toBe(true);
  });

  it('preserves existing widget if not found in updateWidgetsBulkSuccess', () => {
    const initialState = {
      ...initialUserState,
      widgets: [{ dbId: 'stay', order: 1 }] as any[],
    };

    const updates = [{ dbId: 'other', order: 2 }] as any[];

    const state = userInfoReducer(
      initialState,
      UserInfoActions.updateWidgetsBulkSuccess({ widgets: updates }),
    );

    expect(state.widgets[0].dbId).toBe('stay');
  });
});
