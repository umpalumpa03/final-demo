import { selectActiveTheme } from './theme.selectors';
import { describe, it, expect } from 'vitest';

describe('Theme Selectors', () => {
  it('should select the active theme', () => {
    const initialState = { activeTheme: 'royal-blue' };
    const result = selectActiveTheme.projector(initialState);
    expect(result).toBe('royal-blue');
  });
});
