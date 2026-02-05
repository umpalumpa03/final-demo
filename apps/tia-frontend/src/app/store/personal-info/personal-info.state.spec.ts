import { describe, it, expect } from 'vitest';
import type { personalInfoState } from './personal-info.state';

describe('personalInfoState', () => {
  it('should allow creating a valid empty state object', () => {
    const state: personalInfoState = {
      pId: null,
      phoneNumber: null,
      loading: false,
      error: null,
    };

    expect(state.pId).toBeNull();
    expect(state.phoneNumber).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});

