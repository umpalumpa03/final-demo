import { ActionReducer, Action } from '@ngrx/store';
import { UserInfoActions } from './user-info/user-info.actions';

export function clearStateMetaReducer<T>(
  reducer: ActionReducer<T>,
): ActionReducer<T> {
  return (state: T | undefined, action: Action) => {
    if (action.type === UserInfoActions.logout.type) {
      return reducer(undefined, action);
    }
    return reducer(state, action);
  };
}
