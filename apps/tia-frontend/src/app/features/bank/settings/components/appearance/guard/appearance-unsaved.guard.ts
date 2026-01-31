import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';

export const appearanceUnsavedGuard: CanDeactivateFn<any> = (component, currentRoute, currentState, nextState) => {
  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    return window.confirm('You have unsaved changes. Are you sure you want to leave without saving?');
  }
  return true;
};