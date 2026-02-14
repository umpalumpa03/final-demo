import { userInfoReducer, initialUserState } from './user-info.reducer';
import { UserInfoActions } from './user-info.actions';
import { describe, it, expect } from 'vitest';


describe('userInfoReducer', () => {
  it('sets loading on loadUser', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUser());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('applies loadUserSuccess', () => {
    const user = { fullName: 'John', email: 'a@b.com', role: null } as any;
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserSuccess({ user }));
    expect(state.fullName).toBe('John');
    expect(state.email).toBe('a@b.com');
    expect(state.loaded).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('applies loadUserError', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.loadUserError({ error: 'fail' }));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('fail');
  });

  it('loads widgets and sorts them on success', () => {
    const widgets = [
      { dbId: '1', order: 5 } as any,
      { dbId: '2', order: 1 } as any,
      { dbId: '3' } as any,
    ];
    const state = userInfoReducer(initialUserState, UserInfoActions.loadWidgetsSuccess({ widgets }));
    expect(state.widgets.length).toBe(3);
    expect(state.widgets[0].dbId).toBe('2');
    expect(state.widgets[2].dbId).toBe('3');
    expect(state.widgetsLoaded).toBe(true);
    expect(state.widgetsLoading).toBe(false);
  });

  it('updateWidgetsBulkSuccess merges and hides inactive', () => {
    const start = { ...initialUserState, widgets: [ { dbId: 'a', order: 1, isHidden: false }, { dbId: 'b', order: 2 } ] as any };
    const updates = [ { dbId: 'a', order: 3, isActive: false } as any ];
    const state = userInfoReducer(start, UserInfoActions.updateWidgetsBulkSuccess({ widgets: updates }));
    expect(state.widgets.find((w) => w.dbId === 'a')!.order).toBe(3);
    expect(state.widgets.find((w) => w.dbId === 'a')!.isHidden).toBe(true);
  });

  it('deleteWidgetSuccess removes widget', () => {
    const start = { ...initialUserState, widgets: [ { dbId: 'x' } as any, { dbId: 'y' } as any ] as any };
    const state = userInfoReducer(start, UserInfoActions.deleteWidgetSuccess({ id: 'x' }));
    expect(state.widgets.find((w) => w.dbId === 'x')).toBeUndefined();
    expect(state.widgetsLoading).toBe(false);
  });

  it('error actions set error and reset loading flags', () => {
    const actions = [
      UserInfoActions.loadUserError({ error: 'e' }),
      UserInfoActions.loadWidgetsError({ error: 'e' }),
      UserInfoActions.createWidgetError({ error: 'e' }),
      UserInfoActions.updateWidgetsBulkError({ error: 'e' }),
      UserInfoActions.deleteWidgetError({ error: 'e' }),
    ];
    actions.forEach((a) => {
      const s = userInfoReducer(initialUserState, a as any);
      expect(s.loading).toBe(false);
      expect(s.widgetsLoading).toBe(false);
      expect(s.error).toBe('e');
    });
  });

  it('sets onboarding and birthday fields', () => {
    const s1 = userInfoReducer(initialUserState, UserInfoActions.loadHasCompletedOnboarding({ onboCompleted: true }));
    expect(s1.hasCompletedOnboarding).toBe(true);

    const s2 = userInfoReducer(initialUserState, UserInfoActions.loadBirthday({ birthDay: '2000-01-01' }));
    expect(s2.birthday).toBe('2000-01-01');

    const s3 = userInfoReducer(initialUserState, UserInfoActions.loadBirthdayModalClosed({ colsedBirthdayModal: 2020 }));
    expect(s3.birthdayModalClosedYear).toBe(2020);
  });

  it('handles dismissBirthdayModal action', () => {
    const state = userInfoReducer(initialUserState, UserInfoActions.dismissBirthdayModal({ year: 2024 }));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });
});

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
