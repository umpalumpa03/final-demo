import { createFeature, createReducer, on } from '@ngrx/store';
import { SecurityActions } from './security.actions';
import { initialSecurityState, SecurityState } from './security.state';

export const securityFeature = createFeature({
  name: 'security',
  reducer: createReducer(
    initialSecurityState,
  
    on(SecurityActions.changePassword, (state) => ({
      ...state,
      loading: true,
      error: null,
      success: false,
    })),
  
    on(SecurityActions.changePasswordSuccess, (state) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
    })),
  
    on(SecurityActions.changePasswordFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
      success: false,
    })),
  ),
});