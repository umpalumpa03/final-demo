import { securityFeature } from './security.reducer';
import { SecurityActions } from './security.actions';
import { initialSecurityState } from './security.state';

describe('securityFeature reducer', () => {

  it('should set loading true and reset flags on changePassword', () => {
    const prev = { ...initialSecurityState, loading: false, error: 'Old error', success: true };

    const next = securityFeature.reducer(
      prev,
      SecurityActions.changePassword({ currentPassword: 'old', newPassword: 'new' }),
    );

    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
    expect(next.success).toBe(false);
  });

  it('should set success true on changePasswordSuccess', () => {
    const prev = { ...initialSecurityState, loading: true, error: 'x', success: false };

    const next = securityFeature.reducer(prev, SecurityActions.changePasswordSuccess());

    expect(next.loading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.success).toBe(true);
  });

  it('should set error on changePasswordFailure', () => {
    const prev = { ...initialSecurityState, loading: true, error: null, success: true };

    const next = securityFeature.reducer(
      prev,
      SecurityActions.changePasswordFailure({ error: 'Bad request' }),
    );

    expect(next.loading).toBe(false);
    expect(next.error).toBe('Bad request');
    expect(next.success).toBe(false);
  });

  it('should clear error on clearError', () => {
    const prev = { ...initialSecurityState, error: 'Some error', loading: false, success: false };

    const next = securityFeature.reducer(prev, SecurityActions.clearError());

    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
    expect(next.success).toBe(false);
  });

  it('should clear success on clearSuccess', () => {
    const prev = { ...initialSecurityState, success: true, loading: false, error: null };

    const next = securityFeature.reducer(prev, SecurityActions.clearSuccess());

    expect(next.success).toBe(false);
    expect(next.loading).toBe(false);
    expect(next.error).toBeNull();
  });

  it('should clear error without affecting other state properties', () => {
    const prev = { ...initialSecurityState, error: 'Test error', loading: true, success: true };

    const next = securityFeature.reducer(prev, SecurityActions.clearError());

    expect(next.error).toBeNull();
    expect(next.loading).toBe(true);
    expect(next.success).toBe(true);
  });

});
