import { describe, it, expect } from 'vitest';
import { personalInfoReducer, initialPersonalInfoState } from './personal-info.reducer';
import { PersonalInfoActions } from './pesronal-info.actions';
import type { personalInfoState } from './personal-info.state';

describe('personalInfoReducer', () => {
  const mockPersonalInfo: personalInfoState = {
    pId: '12345678901',
    phoneNumber: '555999333',
    loading: false,
    error: null,
  };

  it('should set loading true and clear error on loadPersonalInfo', () => {
    const state = personalInfoReducer(
      initialPersonalInfoState,
      PersonalInfoActions.loadPersonalInfo({}),
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should merge personal info on loadPersonalInfoSuccess', () => {
    const state = personalInfoReducer(
      initialPersonalInfoState,
      PersonalInfoActions.loadPersonalInfoSuccess({ personalInfo: mockPersonalInfo }),
    );
    expect(state.pId).toBe(mockPersonalInfo.pId);
    expect(state.phoneNumber).toBe(mockPersonalInfo.phoneNumber);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set error on loadPersonalInfoFailure', () => {
    const state = personalInfoReducer(
      initialPersonalInfoState,
      PersonalInfoActions.loadPersonalInfoFailure({ error: 'Oops' }),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Oops');
  });

  it('should update phoneNumber on loadPersonalInfoPhoneNumber', () => {
    const state = personalInfoReducer(
      initialPersonalInfoState,
      PersonalInfoActions.loadPersonalInfoPhoneNumber({ phoneNumber: mockPersonalInfo.phoneNumber! }),
    );
    expect(state.phoneNumber).toBe(mockPersonalInfo.phoneNumber);
  });

  it('should update pId on loadPersonalInfoPId', () => {
    const state = personalInfoReducer(
      initialPersonalInfoState,
      PersonalInfoActions.loadPersonalInfoPId({ pId: mockPersonalInfo.pId! }),
    );
    expect(state.pId).toBe(mockPersonalInfo.pId);
  });

  it('should merge personal info on updatePersonalInfo', () => {
    const existing = { ...initialPersonalInfoState, pId: 'old', phoneNumber: '111' };
    const update = { ...mockPersonalInfo, pId: 'new', phoneNumber: '222' };
    const state = personalInfoReducer(
      existing,
      PersonalInfoActions.updatePersonalInfo({ personalInfo: update }),
    );
    expect(state.pId).toBe('new');
    expect(state.phoneNumber).toBe('222');
  });

  it('should reset to initial state on resetPersonalInfo', () => {
    const populatedState: personalInfoState = {
      pId: '12345678901',
      phoneNumber: '555999333',
      loading: true,
      error: 'Some error',
    };
    const state = personalInfoReducer(
      populatedState,
      PersonalInfoActions.resetPersonalInfo(),
    );
    expect(state).toEqual(initialPersonalInfoState);
  });
});

