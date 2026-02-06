import {
  unsavedChangesGuard,
  CanComponentDeactivate,
} from './unsaved-changes.guard';
import { describe, it, expect, vi } from 'vitest';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('unsavedChangesGuard', () => {
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  it('should return true if the component does not implement canDeactivate', () => {
    const component = {} as any;

    const result = unsavedChangesGuard(
      component,
      mockRoute,
      mockState,
      mockState,
    );

    expect(result).toBe(true);
  });

  it('should return the value from the components canDeactivate method (true)', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: vi.fn().mockReturnValue(true),
    };

    const result = unsavedChangesGuard(
      component,
      mockRoute,
      mockState,
      mockState,
    );

    expect(component.canDeactivate).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return the value from the components canDeactivate method (false)', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: vi.fn().mockReturnValue(false),
    };

    const result = unsavedChangesGuard(
      component,
      mockRoute,
      mockState,
      mockState,
    );

    expect(component.canDeactivate).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return true when navigating to allowed route', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: vi.fn().mockReturnValue(false),
    };
    const nextState = { url: '/auth/sign-in' } as RouterStateSnapshot;

    const result = unsavedChangesGuard(
      component,
      mockRoute,
      mockState,
      nextState,
    );

    expect(component.canDeactivate).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return true when navigating to allowed route with different format', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: vi.fn().mockReturnValue(false),
    };
    const nextState = { url: 'auth/sign-in' } as RouterStateSnapshot;

    const result = unsavedChangesGuard(
      component,
      mockRoute,
      mockState,
      nextState,
    );

    expect(component.canDeactivate).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
