import { describe, it, expect, vi } from 'vitest';
import {clearStateMetaReducer} from './meta-reducers';
import { UserInfoActions } from './user-info/user-info.actions';

describe('clearStateMetaReducer', () => {
  it('should return undefined state (initial state) when logout action is dispatched', () => {
    const initialState = { user: 'Mariam', theme: 'dark' };
    const logoutAction = UserInfoActions.logout();

    const mockReducer = vi.fn((state) => state);
    const metaReducer = clearStateMetaReducer(mockReducer);

    metaReducer(initialState, logoutAction);
    expect(mockReducer).toHaveBeenCalledWith(undefined, logoutAction);
  });

  it('should pass through the state for any other action', () => {
    const currentState = { user: 'Mariam', theme: 'dark' };
    const otherAction = { type: '[Other] Some Action' } as any;

    const mockReducer = vi.fn((state) => state);
    const metaReducer = clearStateMetaReducer(mockReducer);

    metaReducer(currentState, otherAction);

    expect(mockReducer).toHaveBeenCalledWith(currentState, otherAction);
  });
});
