import { initialSecurityState, SecurityState } from './security.state';

describe('SecurityState', () => {
  it('should define initialSecurityState correctly', () => {
    const state: SecurityState = initialSecurityState;

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });
});