import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from './can-deactivate.interface';

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (component.canDeactivate) {
    return component.canDeactivate();
  }
  return true;
};