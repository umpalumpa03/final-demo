import { describe, it, expect } from 'vitest';
import type { personalInfoState } from './personal-info.state';

describe('personalInfoState', () => {
  it('should allow creating a valid empty state object', () => {
    const state: personalInfoState = {
      pId: null,
      phoneNumber: null,
      loading: false,
      error: null,
      phoneUpdateChallengeId: null,
      phoneUpdateLoading: false,
      phoneUpdateError: null,
      phoneUpdatePendingPhone: null,
      phoneUpdateResendCount: 0,
    };

    expect(state.pId).toBeNull();
    expect(state.phoneNumber).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.phoneUpdateChallengeId).toBeNull();
    expect(state.phoneUpdateLoading).toBe(false);
    expect(state.phoneUpdateError).toBeNull();
    expect(state.phoneUpdatePendingPhone).toBeNull();
    expect(state.phoneUpdateResendCount).toBe(0);
  });
});

