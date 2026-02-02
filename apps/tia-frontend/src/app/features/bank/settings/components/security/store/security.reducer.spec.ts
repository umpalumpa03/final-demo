import { securityFeature } from './security.reducer';
import { SecurityActions } from './security.actions';
import { initialSecurityState } from './security.state';

describe('securityFeature reducer', () => {


  it('should set success true on changePasswordSuccess', () => {
    const prev = { ...initialSecurityState, loading: true, error: 'x', success: false };

    const next = securityFeature.reducer(prev, SecurityActions.changePasswordSuccess());

    expect(next.loading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.success).toBe(true);
  });

});
