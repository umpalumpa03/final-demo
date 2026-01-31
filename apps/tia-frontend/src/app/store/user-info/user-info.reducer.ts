import { createReducer, on } from '@ngrx/store';
import { UserInfoActions } from './user-info.actions';
import { IUserState } from './models/user-info.model';

export const initialUserState: IUserState = {
  fullName: null,
  theme: localStorage.getItem('theme'),
  language: localStorage.getItem('language'),
  avatar: null,
  role: null,
  loading: false,
  error: null,
};

export const userInfoReducer = createReducer(
  initialUserState,

  on(UserInfoActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserInfoActions.loadUserSuccess, (state, { user }) => {
    return {
      ...state,
      ...user,
      loading: false,
      error: null,
    };
  }),

  on(UserInfoActions.loadUserError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
