import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

const ALLOWED_ROUTES = ['auth/sign-in', '/auth/sign-in'];

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  if (
    nextState?.url &&
    ALLOWED_ROUTES.some((route) => nextState.url.includes(route))
  ) {
    return true;
  }

  if (component.canDeactivate) {
    return component.canDeactivate();
  }
  return true;
};
