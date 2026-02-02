import {
    selectSecurityLoading,
    selectSecurityError,
    selectSecuritySuccess,
  } from './security.selectors';
  import { SecurityState } from './security.state';
  
  describe('Security Selectors', () => {
    const state: SecurityState = {
      loading: true,
      error: 'Some error',
      success: false,
    };

  it('should select success', () => {
      const result = selectSecuritySuccess.projector(state);
      expect(result).toBe(false);
    });
  });
  