import {
    selectSecurityLoading,
    selectSecurityError,
    selectSecuritySuccess,
  } from './security.selectors';
  import { SecurityState } from './security.state';
  
  describe('Security Selectors', () => {
    const state: { security: SecurityState } = {
      security: {
        loading: true,
        error: 'Some error',
        success: false,
      },
    };
  
    it('should select loading', () => {
      const result = selectSecurityLoading(state);
      expect(result).toBe(true);
    });
  
    it('should select error', () => {
      const result = selectSecurityError(state);
      expect(result).toBe('Some error');
    });
  
    it('should select success', () => {
      const result = selectSecuritySuccess(state);
      expect(result).toBe(false);
    });
  });
  